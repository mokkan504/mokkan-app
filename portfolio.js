(function () {
  const STORAGE_KEY = "mokkanPortfolio";
  const grid = document.getElementById("portfolioGrid");
  const empty = document.getElementById("emptyPortfolio");

  const defaults = [
    {
      id: "sample-dining",
      title: "결의 자리",
      category: "식탁",
      image: "./assets/mokkan-render-dining-table.png",
      description: "얇은 상판과 판형 다리, 하부 연결대가 단정한 균형을 이루는 식탁입니다. 식사의 시간에 차분한 중심을 더합니다.",
      material: "월넛",
      status: "대표 제품"
    },
    {
      id: "sample-desk",
      title: "사유의 자리",
      category: "책상",
      image: "./assets/mokkan-render-desk.png",
      description: "넓은 무릎 공간과 얕은 서랍을 더한 책상입니다. 오래 머무는 작업의 시간을 담백하게 받쳐줍니다.",
      material: "월넛",
      status: "대표 제품"
    },
    {
      id: "sample-side",
      title: "여백의 자리",
      category: "사이드 테이블",
      image: "./assets/mokkan-render-side-table.png",
      description: "작은 상판과 하부 선반으로 생활의 빈틈을 조용히 채우는 테이블입니다. 필요한 물건을 곁에 두되 공간을 무겁게 만들지 않습니다.",
      material: "월넛",
      status: "대표 제품"
    },
    {
      id: "portfolio-curved-cabinet",
      title: "둥근 결의 수납",
      category: "수납장",
      image: "./assets/portfolio-curved-cabinet-render.png",
      description: "곡면 도어와 황동 손잡이가 작은 공간에 깊이를 더하는 수납장입니다. 짙은 목재의 결이 차분한 분위기 속에서 은은하게 드러납니다.",
      material: "짙은 원목 · 황동",
      status: "포트폴리오"
    },
    {
      id: "portfolio-shelf-table",
      title: "층의 테이블",
      category: "테이블",
      image: "./assets/portfolio-shelf-table-render.png",
      description: "상판 아래의 구조와 하부 선반이 리듬을 이루는 테이블입니다. 열린 구조가 공간을 가볍게 만들고, 나무의 결이 중심을 잡아줍니다.",
      material: "원목",
      status: "포트폴리오"
    },
    {
      id: "portfolio-finished-lounge-chair",
      title: "결의 안락의자",
      category: "의자",
      image: "./assets/portfolio-finished-lounge-chair-render.png",
      description: "넓은 팔걸이와 기울어진 등받이, 열린 하부 구조가 안정감을 이루는 원목 의자입니다. 직선적인 골조 안에서 나무의 결이 또렷하게 드러납니다.",
      material: "원목",
      status: "포트폴리오"
    },
    {
      id: "portfolio-nihon-side-table",
      title: "니혼 사이드 테이블",
      category: "사이드 테이블",
      image: "./assets/portfolio-nihon-side-table-render.png",
      description: "짙은 상판과 판형 지지대, 밝은 세로 다리가 대비를 이루는 작은 테이블입니다. 절제된 구조와 목재의 결이 조용한 균형감을 만듭니다.",
      material: "원목",
      status: "포트폴리오"
    },
    {
      id: "portfolio-wooden-chair-stool",
      title: "결맞춤 의자와 스툴",
      category: "의자",
      image: "./assets/portfolio-wooden-chair-stool-render.png",
      description: "묵직한 팔걸이 의자와 낮은 스툴이 한 세트로 놓이는 작품입니다. 짙은 목재와 밝은 포인트가 대비를 이루며 구조적인 인상을 선명하게 보여줍니다.",
      material: "원목",
      status: "포트폴리오"
    },
    {
      id: "portfolio-dark-wood-chair-set",
      title: "고요한 결의 의자 세트",
      category: "의자",
      image: "./assets/portfolio-dark-wood-chair-set-render.png",
      description: "짙은 목재의 암체어와 사이드 테이블, 낮은 스툴이 하나의 균형을 이루는 세트입니다. 절제된 구조와 깊은 나뭇결이 차분한 실내에 단정한 존재감을 더합니다.",
      material: "원목 · 오일 마감",
      status: "포트폴리오"
    }
    ,{
      id: "portfolio-dark-wood-armchair-table",
      title: "고요한 결의 암체어와 사이드 테이블",
      category: "의자",
      image: "./assets/portfolio-dark-wood-armchair-table-render.png",
      description: "곧게 뻗은 프레임과 열린 등받이가 돋보이는 암체어에 낮은 사이드 테이블을 조합한 작품입니다. 짙은 목재의 선명한 결이 절제된 구조에 깊이와 온기를 더합니다.",
      material: "원목 · 오일 마감",
      status: "포트폴리오"
    }
  ];

  const hiddenLegacyIds = new Set(["portfolio-wooden-lounge-chair", "portfolio-wooden-armchair", "portfolio-wooden-armchair-wide"]);
  const hiddenLegacyTitles = new Set(["머무름의 의자", "품의 의자", "넓은 팔걸이 의자"]);

  function readItems() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return defaults.concat(saved).filter((item) => {
        return !hiddenLegacyIds.has(item.id) && !hiddenLegacyTitles.has(item.title);
      });
    } catch (error) {
      return defaults;
    }
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function render() {
    if (!grid) return;
    const items = readItems();
    if (empty) empty.hidden = items.length > 0;
    grid.innerHTML = items.map((item) => [
      '<article class="portfolio-card">',
      '<img src="' + escapeHtml(item.image || "./assets/mokkan-about-workshop.png") + '" alt="' + escapeHtml(item.title) + '">',
      "<div>",
      "<span>" + escapeHtml(item.category) + "</span>",
      "<h3>" + escapeHtml(item.title) + "</h3>",
      "<p>" + escapeHtml(item.description) + "</p>",
      '<small>' + escapeHtml([item.material, item.status].filter(Boolean).join(" · ")) + "</small>",
      "</div>",
      "</article>"
    ].join("")).join("");
  }

  render();
})();
