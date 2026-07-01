(function () {
  const FINDER_GUIDE_KEY = "mokkanFinderGuide";

  const furnitureLabels = {
    table: "식탁/테이블",
    desk: "책상/작업대",
    chair: "의자/스툴",
    storage: "수납장/선반",
    side: "사이드 테이블/협탁",
    bed: "침대/침실 가구",
    lighting: "조명/무드등",
    other: "그 외 가구"
  };

  const questions = [
    {
      type: "multiple",
      title: "어떤 가구나 생활 오브제를 검토하고 계신가요?",
      helper: "목록에 정확히 맞지 않아도 가장 가까운 항목을 선택해주세요. 여러 종류를 함께 원하신다면 모두 선택할 수 있습니다.",
      options: [
        { value: "table", label: "식탁 또는 큰 테이블", insight: "상판 크기, 착석 간격, 동선 검토가 필요합니다.", scores: { table: 4, generous: 2, urethane: 1, balanced: 1 } },
        { value: "desk", label: "책상 또는 작업대", insight: "작업 자세, 상판 깊이, 배선과 수납 계획이 중요합니다.", scores: { desk: 4, tailored: 2, minimal: 1, ash: 1 } },
        { value: "chair", label: "의자, 벤치 또는 스툴", insight: "좌판 높이, 등받이 각도, 모서리 촉감을 함께 봐야 합니다.", scores: { chair: 4, rounded: 2, soft: 1, oil: 1 } },
        { value: "storage", label: "수납장, 선반 또는 진열장", insight: "수납물 크기, 문 여는 방향, 하드웨어 내구성이 핵심입니다.", scores: { storage: 4, tailored: 2, structural: 2 } },
        { value: "side", label: "사이드 테이블 또는 협탁", insight: "주변 가구 높이와 손이 닿는 위치를 맞춰야 합니다.", scores: { side: 4, compact: 2, cherry: 1, soft: 1 } },
        { value: "bed", label: "침대 또는 침실 가구", insight: "매트리스 규격, 침실 동선, 수납 여부를 함께 검토해야 합니다.", scores: { bed: 4, generous: 2, tailored: 2, balanced: 1, oak: 1 } },
        { value: "lighting", label: "조명, 무드등 또는 조명 오브제", insight: "빛의 방향, 눈부심, 배선 위치, 목재와 빛의 분위기가 중요합니다.", scores: { lighting: 4, compact: 2, soft: 2, cherry: 1, oil: 1 } },
        { value: "other", label: "그 외 가구 또는 생활 오브제", insight: "제품명보다 쓰임과 설치 조건을 기준으로 설계 범위를 정리해야 합니다.", scores: { other: 4, tailored: 3, structural: 1, balanced: 1 } }
      ]
    },
    {
      title: "이 가구가 공간에서 맡아야 할 역할은 무엇에 가장 가깝나요?",
      options: [
        { label: "공간의 중심이 되는 대표 가구였으면 합니다.", insight: "비례와 존재감, 주변 동선의 균형을 우선 분석합니다.", scores: { table: 2, generous: 3, walnut: 2, balanced: 3 } },
        { label: "매일 반복해서 쓰는 실용 가구였으면 합니다.", insight: "내구성, 관리성, 손이 닿는 디테일을 우선 분석합니다.", scores: { desk: 1, chair: 1, urethane: 3, tailored: 2 } },
        { label: "부족한 수납이나 기능을 해결했으면 합니다.", insight: "수납물 종류, 내부 구조, 하드웨어 계획을 우선 분석합니다.", scores: { storage: 4, structural: 3, tailored: 2 } },
        { label: "공간의 분위기를 완성하는 오브제였으면 합니다.", insight: "색감, 형태의 밀도, 조명과 그림자 효과를 우선 분석합니다.", scores: { lighting: 2, side: 1, cherry: 2, soft: 3, oil: 2 } }
      ]
    },
    {
      title: "사용 빈도와 사용 강도는 어느 정도인가요?",
      options: [
        { label: "하루에도 여러 번 사용하고 오염이나 마찰이 잦습니다.", insight: "보호력 높은 마감과 보수 가능한 구조를 우선 검토합니다.", scores: { urethane: 5, oak: 2, structural: 1 } },
        { label: "매일 쓰지만 비교적 조심스럽게 관리할 수 있습니다.", insight: "촉감과 내구성의 균형을 기준으로 수종과 마감을 검토합니다.", scores: { oil: 2, urethane: 2, balanced: 2, standard: 1 } },
        { label: "자주 쓰지는 않지만 공간에서 계속 보이는 가구입니다.", insight: "조형성, 색감, 주변 가구와의 관계를 우선 검토합니다.", scores: { walnut: 2, cherry: 2, soft: 2, balanced: 2 } },
        { label: "계절이나 상황에 따라 위치와 용도가 달라질 수 있습니다.", insight: "무게, 이동성, 크기의 여유를 함께 검토합니다.", scores: { side: 2, lighting: 1, compact: 3, minimal: 2 } }
      ]
    },
    {
      title: "가구와 몸이 만나는 방식은 어떤 쪽에 가깝나요?",
      options: [
        { label: "앉거나 기대는 시간이 길어 몸의 편안함이 중요합니다.", insight: "높이, 각도, 모서리 반경, 착석감을 중심으로 분석합니다.", scores: { chair: 4, bed: 2, rounded: 4, soft: 3, tailored: 2 } },
        { label: "팔과 손이 오래 닿아 작업 자세가 중요합니다.", insight: "상판 높이, 깊이, 팔의 각도와 표면 촉감을 분석합니다.", scores: { desk: 4, tailored: 3, oil: 1, minimal: 1 } },
        { label: "몸보다 물건을 올리고 꺼내는 동작이 더 많습니다.", insight: "하중, 수납 깊이, 문 여닫음, 상판 보호력을 분석합니다.", scores: { storage: 3, table: 2, structural: 3, urethane: 2 } },
        { label: "직접 닿기보다 빛, 분위기, 시선의 역할이 큽니다.", insight: "형태의 실루엣, 빛의 방향, 주변 색감을 분석합니다.", scores: { lighting: 4, side: 1, soft: 3, cherry: 1 } }
      ]
    },
    {
      title: "설치할 공간에서 가장 큰 제약은 무엇인가요?",
      options: [
        { label: "벽, 코너, 창가, 콘센트 등 정해진 위치에 맞춰야 합니다.", insight: "실측 기반의 폭, 깊이, 높이와 배선 위치가 중요합니다.", scores: { tailored: 5, structural: 2, storage: 1, desk: 1 } },
        { label: "문, 의자, 침대, 사람의 이동 동선이 빠듯합니다.", insight: "모서리 처리, 깊이 축소, 이동 동선 확보를 분석합니다.", scores: { compact: 4, rounded: 3, side: 1, bed: 1 } },
        { label: "충분히 넓지만 공간 중심에서 비례가 좋아야 합니다.", insight: "가구의 존재감과 주변 여백의 균형을 분석합니다.", scores: { generous: 4, table: 2, walnut: 1, balanced: 3 } },
        { label: "아직 위치가 확정되지 않아 유연하게 배치하고 싶습니다.", insight: "표준 치수, 이동성, 다양한 배치에 맞는 형태를 분석합니다.", scores: { standard: 4, minimal: 2, side: 1, lighting: 1 } }
      ]
    },
    {
      title: "가구 위나 안에는 주로 어떤 조건의 물건이 놓이나요?",
      options: [
        { label: "물기, 음식, 뜨거운 그릇처럼 표면 손상이 우려됩니다.", insight: "상판 보호력과 관리 난이도를 우선 분석합니다.", scores: { table: 3, oak: 2, urethane: 5, generous: 1 } },
        { label: "전자기기, 모니터, 조명처럼 배선과 반복 사용이 있습니다.", insight: "배선 구멍, 케이블 레일, 상판 깊이를 분석합니다.", scores: { desk: 3, lighting: 2, tailored: 2, urethane: 1 } },
        { label: "책, 옷, 생활용품처럼 종류와 크기가 다양합니다.", insight: "수납 칸의 모듈, 하중, 문 또는 선반 구조를 분석합니다.", scores: { storage: 4, structural: 3, tailored: 2 } },
        { label: "가벼운 장식품이나 자주 손이 가는 작은 물건입니다.", insight: "작은 비례, 손이 닿는 높이, 분위기 중심의 디자인을 분석합니다.", scores: { side: 3, lighting: 2, compact: 2, cherry: 2, oil: 1 } }
      ]
    },
    {
      title: "치수와 설계 기준은 어느 정도 준비되어 있나요?",
      options: [
        { label: "가로, 깊이, 높이와 설치 위치가 거의 정해져 있습니다.", insight: "설계도와 렌더링을 빠르게 구체화하기 좋은 상태입니다.", scores: { tailored: 5, structural: 1 } },
        { label: "대략적인 크기만 있고 정확한 치수는 상담이 필요합니다.", insight: "사용 인원, 주변 가구 높이, 실측 정보를 추가로 확인해야 합니다.", scores: { standard: 2, tailored: 3, balanced: 1 } },
        { label: "원하는 분위기는 있지만 크기와 구조는 아직 열려 있습니다.", insight: "디자인 방향과 공간 사진을 바탕으로 제안형 설계가 필요합니다.", scores: { balanced: 3, walnut: 1, cherry: 1, soft: 1 } },
        { label: "참고 이미지가 있어 비례와 분위기를 따라가고 싶습니다.", insight: "참고 이미지의 구조, 비례, 색감을 분리해 분석해야 합니다.", scores: { tailored: 3, structural: 2, minimal: 1 } }
      ]
    },
    {
      title: "관리 방식과 마감에서는 무엇을 더 중시하시나요?",
      options: [
        { label: "오염, 습기, 잦은 사용에 강한 실용성이 우선입니다.", insight: "우레탄 또는 보호력 높은 마감이 적합한지 검토합니다.", scores: { oak: 3, urethane: 5, table: 1, chair: 1 } },
        { label: "나무의 촉감과 시간이 쌓이는 변화를 느끼고 싶습니다.", insight: "오일 마감과 관리 주기를 함께 안내하는 방향이 좋습니다.", scores: { walnut: 1, cherry: 2, oil: 5, soft: 1 } },
        { label: "아이, 반려동물, 좁은 동선 때문에 안정감이 중요합니다.", insight: "모서리 반경, 전도 안정성, 표면 보호를 함께 봐야 합니다.", scores: { oak: 2, urethane: 2, rounded: 4, soft: 2 } },
        { label: "경첩, 레일, 짜임처럼 오래 버티는 구조가 중요합니다.", insight: "하드웨어와 목구조의 내구성을 중심으로 설계해야 합니다.", scores: { storage: 3, structural: 4, tailored: 1 } }
      ]
    },
    {
      title: "공간에서 원하는 시각적 인상은 무엇인가요?",
      options: [
        { label: "묵직하고 고요한 중심감이 있었으면 합니다.", insight: "어두운 수종과 안정적인 비례가 잘 맞을 수 있습니다.", scores: { walnut: 4, generous: 2, balanced: 3 } },
        { label: "밝고 단정하며 공간을 넓어 보이게 했으면 합니다.", insight: "밝은 수종과 간결한 구조를 우선 검토합니다.", scores: { oak: 3, ash: 1, standard: 2, minimal: 3 } },
        { label: "따뜻하고 부드러운 생활감이 느껴졌으면 합니다.", insight: "체리 계열, 라운드 디테일, 오일 마감이 잘 맞을 수 있습니다.", scores: { cherry: 3, oil: 2, soft: 3, rounded: 1 } },
        { label: "선과 구조가 분명하게 드러났으면 합니다.", insight: "짜임, 하부 구조, 수납선이 디자인 요소가 될 수 있습니다.", scores: { ash: 2, tailored: 2, structural: 4 } }
      ]
    },
    {
      title: "가격, 디자인, 납기 중 가장 먼저 조율하고 싶은 기준은 무엇인가요?",
      options: [
        { label: "예산 안에서 가능한 구조와 수종을 먼저 알고 싶습니다.", insight: "견적 범위에 따라 수종, 크기, 구조를 단계별로 제안해야 합니다.", scores: { standard: 2, oak: 1, minimal: 1 } },
        { label: "디자인 완성도가 중요해서 여러 번 피드백하고 싶습니다.", insight: "설계도와 렌더링 기반의 반복 조율이 적합합니다.", scores: { tailored: 3, balanced: 2, structural: 1 } },
        { label: "희망 납기가 있어 제작 가능 일정을 먼저 확인하고 싶습니다.", insight: "제작 난이도와 납기 가능성을 먼저 검토해야 합니다.", scores: { standard: 2, minimal: 1, urethane: 1 } },
        { label: "품질과 오래 쓰는 가치를 우선하고 싶습니다.", insight: "구조 안정성, 마감, 관리 방식까지 깊게 상담하는 방향이 좋습니다.", scores: { walnut: 2, structural: 3, oil: 1, urethane: 1 } }
      ]
    }
  ];

  const guides = {
    furniture: {
      table: { title: "테이블 중심 제작", text: "상판 크기, 앉는 간격, 의자와의 높이 관계가 핵심입니다. 식탁이나 큰 테이블은 공간의 중심이 되기 쉬워 동선과 시야를 함께 검토하는 방향이 좋습니다." },
      desk: { title: "작업 가구 중심 제작", text: "몸에 맞는 높이, 깊이, 다리 공간, 모니터와 도구 배치가 중요합니다. 사용 자세를 기준으로 치수를 잡고 필요하면 수납이나 배선까지 함께 설계하는 방향이 좋습니다." },
      chair: { title: "착석 가구 중심 제작", text: "의자, 벤치, 스툴은 좌판 높이, 등받이 각도, 모서리 촉감처럼 몸에 닿는 디테일이 중요합니다. 테이블과 함께 쓰는 경우 높이 관계를 반드시 같이 봐야 합니다." },
      storage: { title: "수납 가구 중심 제작", text: "넣을 물건의 크기, 문 여는 방향, 선반 간격, 벽면 치수가 결과를 크게 좌우합니다. 구조와 하드웨어까지 함께 검토하는 맞춤 설계가 잘 맞습니다." },
      side: { title: "작은 보조 가구 중심 제작", text: "침대, 소파, 의자 곁에서 손이 닿는 높이와 이동성이 중요합니다. 작은 가구일수록 주변 가구와의 비례와 색감이 결과를 좌우합니다." },
      bed: { title: "침실 가구 중심 제작", text: "침대와 침실 가구는 매트리스 규격, 사용 높이, 수납 여부, 침실 동선이 중요합니다. 침대 프레임, 헤드보드, 협탁처럼 함께 놓이는 가구의 비례를 같이 검토하는 방향이 좋습니다." },
      lighting: { title: "조명 오브제 중심 제작", text: "조명은 밝기뿐 아니라 그림자, 눈부심, 배선 위치, 목재와 빛의 분위기를 함께 봐야 합니다. 무드등이나 스탠드처럼 공간의 표정을 만드는 오브제는 크기보다 위치와 빛의 방향이 중요합니다." },
      other: { title: "그 외 가구와 생활 오브제 제작", text: "목록에 없는 가구라도 쓰임, 놓일 자리, 필요한 구조를 기준으로 설계 방향을 잡을 수 있습니다. 제품 종류보다 생활에서 어떤 역할을 해야 하는지가 먼저 정리되면 맞춤 제작의 폭이 넓어집니다." },
      mixed: { title: "여러 가구를 함께 맞추는 제작", text: "여러 종류를 함께 원한다면 한 번에 모두 결정하기보다 공통 수종, 마감, 모서리 처리, 높이 기준을 먼저 정하는 것이 좋습니다. 제작 우선순위를 나눠 상담하면 완성도가 높아집니다." },
      set: { title: "세트 구성형 제작", text: "같은 공간에서 함께 쓰는 가구라면 색감, 다리 선, 모서리 반경, 높이 관계를 통일하는 방향이 좋습니다. 테이블과 의자처럼 서로 맞물리는 치수를 먼저 잡는 것이 중요합니다." }
    },
    wood: {
      walnut: { title: "월넛 계열", text: "깊은 색감과 차분한 결이 있어 공간의 중심을 잡는 가구에 잘 어울립니다. 묵직하고 오래가는 인상을 원할 때 참고하기 좋은 수종 방향입니다." },
      oak: { title: "오크 계열", text: "밝고 단단한 인상이 있어 가족이 자주 쓰는 가구나 관리 편의가 중요한 공간에 잘 맞습니다. 다양한 인테리어와도 무난하게 어울립니다." },
      ash: { title: "애쉬 계열", text: "결이 선명하고 비교적 밝은 느낌이 있어 가볍고 정돈된 디자인에 잘 어울립니다. 작업 공간이나 얇은 구조의 가구를 검토할 때 참고하기 좋습니다." },
      cherry: { title: "체리 계열", text: "시간이 지나며 색이 깊어지는 따뜻한 수종입니다. 손이 자주 닿는 작은 가구나 부드러운 분위기를 원하는 공간에 잘 맞습니다." }
    },
    size: {
      compact: { title: "컴팩트한 크기", text: "공간을 많이 차지하지 않도록 폭과 깊이를 줄이고, 필요한 기능을 우선 배치하는 방향이 좋습니다. 이동성이나 주변 동선도 함께 확인해보면 좋습니다." },
      standard: { title: "표준에 가까운 균형형", text: "가구 자체가 튀기보다 공간과 자연스럽게 어울리는 비례가 적합합니다. 사용 인원과 주변 가구 높이를 기준으로 안정적인 치수를 잡는 방향입니다." },
      generous: { title: "넉넉한 사용 크기", text: "상판 여유와 앉는 간격을 충분히 확보하는 방향입니다. 공간의 중심 가구가 되기 쉬우므로 동선과 시야를 함께 검토하는 것이 중요합니다." },
      tailored: { title: "공간 맞춤 치수", text: "벽면, 콘센트, 기존 가구, 수납물 크기에 맞춘 설계가 어울립니다. 실측을 바탕으로 폭, 깊이, 높이, 여닫는 방향까지 세밀하게 조정하는 편이 좋습니다." }
    },
    finish: {
      oil: { title: "오일 마감", text: "나무의 촉감과 자연스러운 변화를 살리는 마감입니다. 물기와 얼룩에는 주의가 필요하지만, 사용하며 손때가 쌓이는 느낌을 좋아한다면 잘 맞습니다." },
      urethane: { title: "우레탄 또는 보호력 높은 마감", text: "오염과 습기에 대한 부담을 줄이고 싶을 때 적합합니다. 식탁, 아이가 쓰는 가구, 사용 빈도가 높은 상판에는 실용적인 방향입니다." }
    },
    design: {
      minimal: { title: "간결한 미니멀 디자인", text: "장식보다 비례와 선을 정돈하는 방향이 어울립니다. 공간을 답답하게 만들지 않고, 작업성과 배치 유연성을 높이기 좋습니다." },
      balanced: { title: "중심감 있는 균형형 디자인", text: "상판과 다리의 안정감, 오래 봐도 질리지 않는 비례를 중시하는 방향입니다. 가족이 함께 쓰는 대표 가구에 잘 맞습니다." },
      soft: { title: "부드러운 생활형 디자인", text: "라운드 모서리와 손에 닿는 촉감을 살리는 방향입니다. 침실, 거실, 아이가 있는 공간처럼 편안한 인상이 필요한 곳에 어울립니다." },
      structural: { title: "구조가 드러나는 맞춤형 디자인", text: "짜임, 수납선, 다리 구조를 디자인 요소로 살리는 방향입니다. 기능이 복합적이거나 공간에 정확히 맞아야 하는 가구에 적합합니다." },
      rounded: { title: "라운드 모서리 중심 디자인", text: "모서리 충격을 줄이고 손이 닿는 감각을 부드럽게 만드는 방향입니다. 어린아이, 반려동물, 좁은 동선이 있는 집에서도 고려하기 좋습니다." }
    }
  };

  const initialScores = {
    table: 0, desk: 0, chair: 0, storage: 0, side: 0, bed: 0, lighting: 0, other: 0, mixed: 0, set: 0,
    walnut: 0, oak: 0, ash: 0, cherry: 0,
    compact: 0, standard: 0, generous: 0, tailored: 0,
    oil: 0, urethane: 0,
    minimal: 0, balanced: 0, soft: 0, structural: 0, rounded: 0
  };

  const state = {
    index: 0,
    selectedFurniture: [],
    answers: [],
    scores: { ...initialScores }
  };

  const categories = {
    furniture: ["table", "desk", "chair", "storage", "side", "bed", "lighting", "other", "mixed", "set"],
    wood: ["walnut", "oak", "ash", "cherry"],
    size: ["compact", "standard", "generous", "tailored"],
    finish: ["oil", "urethane"],
    design: ["minimal", "balanced", "soft", "structural", "rounded"]
  };

  const categoryLabels = {
    furniture: "가구 구성",
    wood: "원목 수종",
    size: "가구 크기",
    finish: "마감 방법",
    design: "디자인 방향"
  };

  const step = document.getElementById("finderStep");
  const count = document.getElementById("finderCount");
  const title = document.getElementById("finderTitle");
  const options = document.getElementById("finderOptions");
  const progress = document.getElementById("finderProgressBar");
  const result = document.getElementById("finderResult");

  function addScores(scores) {
    Object.entries(scores || {}).forEach(([key, value]) => {
      state.scores[key] += value;
    });
  }

  function subtractScores(scores) {
    Object.entries(scores || {}).forEach(([key, value]) => {
      state.scores[key] -= value;
    });
  }

  function mergeScores(items) {
    return items.reduce((acc, item) => {
      Object.entries(item.scores || {}).forEach(([key, value]) => {
        acc[key] = (acc[key] || 0) + value;
      });
      return acc;
    }, {});
  }

  function bestKey(keys) {
    if (keys.includes("mixed") && state.selectedFurniture.length > 1) return "mixed";
    return keys.slice().sort((a, b) => state.scores[b] - state.scores[a])[0];
  }

  function selectedGuides() {
    return Object.entries(categories).map(([category, keys]) => {
      const key = bestKey(keys);
      return { category, key, label: categoryLabels[category], guide: guides[category][key] };
    });
  }

  function sampleSettings(guideSections) {
    const byCategory = guideSections.reduce((acc, item) => {
      acc[item.category] = item.key;
      return acc;
    }, {});
    const wood = {
      walnut: { name: "월넛", base: "#5b3826", dark: "#2f1a12", light: "#8a5a3b" },
      oak: { name: "오크", base: "#c69a61", dark: "#8b6234", light: "#efd19a" },
      ash: { name: "애쉬", base: "#d8bd86", dark: "#9a7a43", light: "#f3e1b1" },
      cherry: { name: "체리", base: "#a95638", dark: "#67301f", light: "#d4865b" }
    }[byCategory.wood] || { name: "원목", base: "#a06b43", dark: "#5c3822", light: "#d3a06e" };
    const finish = byCategory.finish === "urethane"
      ? { name: "보호력 높은 마감", opacity: "0.34", shine: "선명한 표면 보호감" }
      : { name: "오일 마감", opacity: "0.12", shine: "나무 촉감 중심" };
    const design = {
      minimal: "간결한 직선",
      balanced: "균형형 비례",
      soft: "부드러운 생활형",
      structural: "구조가 보이는 디테일",
      rounded: "라운드 모서리"
    }[byCategory.design] || "맞춤 디자인";
    return { wood, finish, design };
  }

  function makeSampleImage(guideSections) {
    const byCategory = guideSections.reduce((acc, item) => {
      acc[item.category] = item.key;
      return acc;
    }, {});
    const wood = byCategory.wood || "walnut";
    const finish = byCategory.finish || "oil";
    const samples = {
      "walnut-oil": "./assets/wood-sample-walnut-oil.png",
      "walnut-urethane": "./assets/wood-sample-walnut-oil.png",
      "oak-oil": "./assets/wood-sample-oak-urethane.png",
      "oak-urethane": "./assets/wood-sample-oak-urethane.png",
      "ash-oil": "./assets/wood-sample-ash-oil.png",
      "ash-urethane": "./assets/wood-sample-ash-oil.png",
      "cherry-oil": "./assets/wood-sample-cherry-oil.png",
      "cherry-urethane": "./assets/wood-sample-cherry-oil.png"
    };
    return samples[wood + "-" + finish] || samples["walnut-oil"];
  }

  function answerData() {
    return state.answers.map((answer, index) => {
      const question = questions[index];
      return {
        step: index + 1,
        question: question?.title || "",
        answers: answer.labels || [],
        insights: answer.insights || []
      };
    }).filter((item) => item.answers.length || item.insights.length);
  }

  function saveGuide(guideSections) {
    const guide = {
      createdAt: new Date().toISOString(),
      selectedFurniture: state.selectedFurniture.map((value) => furnitureLabels[value]),
      sampleImage: makeSampleImage(guideSections),
      analysisData: answerData(),
      sections: guideSections.map((item) => ({
        category: item.label,
        title: item.guide.title,
        text: item.guide.text
      }))
    };
    try {
      sessionStorage.setItem(FINDER_GUIDE_KEY, JSON.stringify(guide));
      localStorage.setItem(FINDER_GUIDE_KEY, JSON.stringify(guide));
    } catch (error) {
      // The guide still renders on this page if browser storage is unavailable.
    }
  }

  function renderQuestion() {
    const question = questions[state.index];
    step.textContent = "Question " + (state.index + 1);
    count.textContent = state.index + 1 + " / " + questions.length;
    title.textContent = question.title;
    progress.style.width = Math.round((state.index / questions.length) * 100) + "%";
    options.innerHTML = "";

    if (question.helper) {
      const helper = document.createElement("p");
      helper.className = "finder-helper";
      helper.textContent = question.helper;
      options.appendChild(helper);
    }

    if (state.index > 0) {
      const back = document.createElement("button");
      back.type = "button";
      back.className = "finder-back";
      back.textContent = "이전 질문으로";
      back.addEventListener("click", goBack);
      options.appendChild(back);
    }

    question.options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "finder-option";
      button.textContent = option.label;
      if (question.type === "multiple") {
        button.setAttribute("aria-pressed", state.selectedFurniture.includes(option.value) ? "true" : "false");
        if (state.selectedFurniture.includes(option.value)) button.classList.add("is-selected");
        button.addEventListener("click", () => toggleFurniture(option));
      } else {
        button.addEventListener("click", () => selectOption(option));
      }
      options.appendChild(button);
    });

    if (question.type === "multiple") {
      const next = document.createElement("button");
      next.type = "button";
      next.className = "finder-next";
      next.textContent = "다음 질문으로";
      next.disabled = !state.selectedFurniture.length;
      next.addEventListener("click", confirmFurnitureSelection);
      options.appendChild(next);
    }
  }

  function toggleFurniture(option) {
    if (state.selectedFurniture.includes(option.value)) {
      state.selectedFurniture = state.selectedFurniture.filter((value) => value !== option.value);
    } else {
      state.selectedFurniture.push(option.value);
    }
    renderQuestion();
  }

  function confirmFurnitureSelection() {
    if (!state.selectedFurniture.length) return;
    const selectedOptions = questions[0].options.filter((option) => state.selectedFurniture.includes(option.value));
    const scores = mergeScores(selectedOptions);
    if (state.selectedFurniture.length > 1) scores.mixed = (scores.mixed || 0) + 5;
    addScores(scores);
    state.answers[0] = {
      type: "multiple",
      selectedFurniture: state.selectedFurniture.slice(),
      labels: selectedOptions.map((option) => option.label),
      insights: selectedOptions.map((option) => option.insight).filter(Boolean),
      scores
    };
    state.index += 1;
    renderQuestion();
  }

  function selectOption(option) {
    addScores(option.scores);
    state.answers[state.index] = {
      type: "single",
      labels: [option.label],
      insights: option.insight ? [option.insight] : [],
      scores: { ...option.scores }
    };
    state.index += 1;
    if (state.index >= questions.length) {
      renderResult();
      return;
    }
    renderQuestion();
  }

  function goBack() {
    const lastAnswerIndex = state.index >= questions.length ? questions.length - 1 : state.index - 1;
    const lastAnswer = state.answers[lastAnswerIndex];
    if (lastAnswer) {
      subtractScores(lastAnswer.scores);
      state.answers.splice(lastAnswerIndex, 1);
      if (lastAnswer.type === "multiple") {
        state.selectedFurniture = lastAnswer.selectedFurniture.slice();
      }
    }
    state.index = Math.max(0, lastAnswerIndex);
    renderQuestion();
  }

  function renderResult() {
    const guideSections = selectedGuides();
    const sampleImage = makeSampleImage(guideSections);
    const analysisData = answerData();
    saveGuide(guideSections);
    progress.style.width = "100%";
    step.textContent = "Complete";
    count.textContent = questions.length + " / " + questions.length;
    title.textContent = "가구 방향 가이드가 준비되었습니다.";
    options.innerHTML = "";

    const restart = document.createElement("button");
    restart.type = "button";
    restart.className = "finder-option restart";
    restart.textContent = "다시 선택하기";
    restart.addEventListener("click", resetFinder);
    options.appendChild(restart);

    const back = document.createElement("button");
    back.type = "button";
    back.className = "finder-back";
    back.textContent = "이전 질문으로";
    back.addEventListener("click", goBack);
    options.appendChild(back);

    result.innerHTML = [
      '<span class="finder-result-label">Your Guide</span>',
      "<h2>상담 전 참고할 가구 방향</h2>",
      "<p>아래 내용은 확정된 제작안이 아니라, 선택한 가구 조합과 사용 습관을 바탕으로 먼저 참고해볼 수 있는 방향입니다.</p>",
      '<figure class="finder-sample">',
      '<img src="' + sampleImage + '" alt="추천 원목 수종과 마감 방법을 적용한 샘플 이미지">',
      '<figcaption>추천 수종과 마감 느낌을 이해하기 위한 참고용 실사 샘플 이미지입니다.</figcaption>',
      '</figure>',
      '<div class="finder-guide-list">',
      guideSections.map((item) => [
        '<section class="finder-guide-item">',
        "<span>" + item.label + "</span>",
        "<h3>" + item.guide.title + "</h3>",
        "<p>" + item.guide.text + "</p>",
        "</section>"
      ].join("")).join(""),
      "</div>",
      '<div class="finder-analysis-list">',
      "<h3>상담 분석 데이터</h3>",
      "<p>아래 항목은 견적 문의 시 함께 전달되어 설계도와 렌더링 제안의 기초 자료로 사용됩니다.</p>",
      analysisData.map((item) => [
        '<section class="finder-analysis-item">',
        "<span>" + item.step + "</span>",
        "<h4>" + item.question + "</h4>",
        "<p><strong>답변</strong> " + item.answers.join(", ") + "</p>",
        item.insights.length ? "<p><strong>분석</strong> " + item.insights.join(" ") + "</p>" : "",
        "</section>"
      ].join("")).join(""),
      "</div>",
      '<div class="finder-result-actions">',
      '<a class="button primary" href="./custom-quote.html?finder=1">이 방향으로 상담 문의</a>',
      '<a class="button ghost dark" href="./journal.html">원목과 마감 읽기</a>',
      "</div>"
    ].join("");
  }

  function resetFinder() {
    state.index = 0;
    state.selectedFurniture = [];
    state.answers = [];
    state.scores = { ...initialScores };
    result.innerHTML = [
      '<span class="finder-result-label">Guide</span>',
      "<h2>응답을 따라 가구 방향이 정리됩니다.</h2>",
      "<p>결과에서는 제품 추천 대신 선택한 가구 조합, 원목 수종, 크기 감각, 마감 방법, 디자인 방향을 안내합니다.</p>",
      '<div class="finder-result-actions">',
      '<a class="button primary" href="./custom-quote.html">상담 문의</a>',
      '<a class="button ghost dark" href="./journal.html">가구 이야기 보기</a>',
      "</div>"
    ].join("");
    renderQuestion();
  }

  if (title && options && result) {
    renderQuestion();
  }
})();
