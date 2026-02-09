(function () {
  'use strict';

  // データは data/places.json を fetch で取得（file:// では CORS のため読めない場合があります → ローカルサーバーで開いてください）
  var data = null;
  var container = document.getElementById('places-container');
  var loadingEl = document.getElementById('loading');

  function getCategoryName(categoryId) {
    return (data.categories[categoryId] && data.categories[categoryId].name) || categoryId;
  }

  function getCategoryIcon(categoryId) {
    return (data.categories[categoryId] && data.categories[categoryId].icon) || '';
  }

  function getCategoryIds() {
    if (data.categoryOrder && Array.isArray(data.categoryOrder)) return data.categoryOrder;
    return ['food', 'play', 'relax', 'learn', 'nature'];
  }

  function buildCategoryButtons() {
    var wrap = document.getElementById('categories-container');
    if (!wrap) return;
    var allBtn = wrap.querySelector('[data-category="all"]');
    wrap.innerHTML = '';
    if (allBtn) wrap.appendChild(allBtn);
    getCategoryIds().forEach(function (id) {
      if (!data.categories[id]) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'category-btn';
      btn.setAttribute('data-category', id);
      btn.setAttribute('aria-pressed', 'false');
      btn.textContent = (getCategoryIcon(id) ? getCategoryIcon(id) + ' ' : '') + getCategoryName(id);
      wrap.appendChild(btn);
    });
  }

  function renderDetailTag(field, value) {
    const span = document.createElement('span');
    span.className = 'detail-tag';
    if (field.type === 'boolean') {
      span.classList.add(value ? 'yes' : 'no');
      span.textContent = field.label + (value ? '：あり' : '：なし');
    } else {
      span.textContent = value ? field.label + '：' + value : field.label + '：—';
    }
    return span;
  }

  function renderPlaceCard(place) {
    var categoryIds = place.categories && place.categories.length ? place.categories : [place.category];
    var primaryId = place.primaryCategory || place.category;
    var cat = data.categories[primaryId];
    var card = document.createElement('article');
    card.className = 'place-card';
    card.setAttribute('data-category', primaryId);

    var header = document.createElement('div');
    header.className = 'place-card-header';
    header.innerHTML = '<h2 class="place-name">' + escapeHtml(place.name) + '</h2>';
    var badgeWrap = document.createElement('div');
    badgeWrap.className = 'place-category-badges';
    categoryIds.forEach(function (cid) {
      if (!cid) return;
      var badge = document.createElement('span');
      badge.className = 'place-category-badge';
      badge.textContent = getCategoryName(cid);
      badgeWrap.appendChild(badge);
    });
    header.appendChild(badgeWrap);
    card.appendChild(header);

    const body = document.createElement('div');
    body.className = 'place-body';

    if (place.description) {
      const desc = document.createElement('p');
      desc.className = 'place-description';
      desc.textContent = place.description;
      body.appendChild(desc);
    }

    const metaKeys = [
      { key: 'address', label: '住所' },
      { key: 'phone', label: '電話' },
      { key: 'hours', label: '営業時間' },
      { key: 'closed', label: '定休日' }
    ];
    const metaList = metaKeys.filter(function (m) { return place[m.key]; });
    if (metaList.length) {
      const dl = document.createElement('dl');
      dl.className = 'place-meta';
      metaList.forEach(function (m) {
        dl.appendChild(document.createElement('dt')).textContent = m.label + '：';
        const dd = document.createElement('dd');
        dd.textContent = place[m.key];
        if (m.key === 'address') {
          const ref = document.createElement('span');
          ref.className = 'address-ref';
          ref.textContent = '（Googleマップ参照）';
          dd.appendChild(document.createTextNode(' '));
          dd.appendChild(ref);
        }
        dl.appendChild(dd);
      });
      body.appendChild(dl);
    }

    const linkWrap = document.createElement('div');
    linkWrap.className = 'place-links';
    if (place.url) {
      const link = document.createElement('a');
      link.href = place.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = 'place-map-link';
      link.textContent = '公式サイト';
      linkWrap.appendChild(link);
    }
    if (place.address) {
      const mapUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(place.address);
      const mapLink = document.createElement('a');
      mapLink.href = mapUrl;
      mapLink.target = '_blank';
      mapLink.rel = 'noopener noreferrer';
      mapLink.className = 'place-map-link';
      mapLink.textContent = 'Googleマップで開く';
      linkWrap.appendChild(mapLink);
    }
    if (linkWrap.children.length) body.appendChild(linkWrap);

    if (cat && cat.fields && place.details && Object.keys(place.details).length > 0) {
      const detailsDiv = document.createElement('div');
      detailsDiv.className = 'place-details';
      detailsDiv.innerHTML = '<p class="place-details-title">子連れ向けの設備・情報</p>';
      const tags = document.createElement('div');
      tags.className = 'detail-tags';
      cat.fields.forEach(function (field) {
        const value = place.details[field.key];
        if (value !== undefined && value !== null && value !== '') {
          tags.appendChild(renderDetailTag(field, value));
        }
      });
      if (tags.children.length) detailsDiv.appendChild(tags);
      body.appendChild(detailsDiv);
    }

    card.appendChild(body);
    return card;
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function render(places) {
    if (loadingEl) loadingEl.classList.add('hidden');
    if (!container) return;
    container.innerHTML = '';
    if (!places.length) {
      container.innerHTML = '<p class="empty-message">このカテゴリにはまだスポットが登録されていません。</p>';
      return;
    }
    places.forEach(function (place) {
      container.appendChild(renderPlaceCard(place));
    });
  }

  function filterByCategory(categoryId) {
    if (categoryId === 'all') return data.places;
    return data.places.filter(function (p) {
      if (p.categories && p.categories.length) return p.categories.indexOf(categoryId) !== -1;
      return p.category === categoryId;
    });
  }

  function initButtons() {
    document.querySelectorAll('.category-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const category = this.getAttribute('data-category');
        document.querySelectorAll('.category-btn').forEach(function (b) {
          b.classList.toggle('active', b.getAttribute('data-category') === category);
          b.setAttribute('aria-pressed', b.getAttribute('data-category') === category ? 'true' : 'false');
        });
        render(filterByCategory(category));
      });
    });
  }

  function initMapEmbed() {
    var url = typeof window.MAP_EMBED_URL === 'string' ? window.MAP_EMBED_URL.trim() : '';
    var placeholder = document.getElementById('map-placeholder');
    var iframe = document.getElementById('map-iframe');
    if (url && placeholder && iframe) {
      iframe.src = url;
      iframe.classList.remove('hidden');
      placeholder.classList.add('hidden');
    }
  }

  function init() {
    if (loadingEl) loadingEl.classList.add('hidden');
    try {
      if (!data.places) data.places = [];
      buildCategoryButtons();
      initButtons();
      render(filterByCategory('all'));
      initMapEmbed();
    } catch (err) {
      if (loadingEl) loadingEl.classList.add('hidden');
      if (container) {
        container.innerHTML = '<p class="empty-message">データの表示中にエラーが発生しました。<br>ブラウザの開発者ツール（F12）→「コンソール」でエラー内容を確認するか、<code>npx serve .</code> でローカルサーバーを起動して開いてみてください。</p>';
      }
      console.error(err);
    }
  }

  function runWhenReady() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runWhenReady);
      return;
    }
    init();
  }

  fetch('data/places.json')
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (json) {
      data = json;
      runWhenReady();
    })
    .catch(function (err) {
      if (loadingEl) loadingEl.classList.add('hidden');
      if (container) {
        container.innerHTML = '<p class="empty-message">データを読み込めませんでした。このページは<strong>ローカルサーバー</strong>で開く必要があります。<br>ターミナルで <code>npx serve .</code> を実行し、表示されたURL（例: http://localhost:3000）で開いてください。</p>';
      }
      console.error(err);
    });
})();
