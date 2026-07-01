(function () {
  const tabs = Array.from(document.querySelectorAll('[data-journal-filter]'));
  const cards = Array.from(document.querySelectorAll('.journal-card[data-category]'));
  const panel = document.getElementById('journalPosts');
  const count = document.getElementById('journalVisibleCount');
  if (!tabs.length || !panel || !count) return;

  const labels = { all: '전체 글', 'wood-knowledge': '목공 지식 글', 'daily-trends': '일일 트렌드 글' };

  function activate(tab, moveFocus) {
    const filter = tab.dataset.journalFilter;
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    let visible = 0;
    cards.forEach((card) => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.hidden = !show;
      if (show) visible += 1;
    });
    panel.setAttribute('aria-label', labels[filter]);
    count.textContent = String(visible);
    if (moveFocus) tab.focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab, false));
    tab.addEventListener('keydown', (event) => {
      let nextIndex = null;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      if (nextIndex !== null) {
        event.preventDefault();
        activate(tabs[nextIndex], true);
      }
    });
  });
})();
