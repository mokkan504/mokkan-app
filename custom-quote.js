(function () {
  const STORAGE_KEY = "mokkanInquiries";
  const FINDER_GUIDE_KEY = "mokkanFinderGuide";
  const form = document.getElementById("customQuoteForm");
  const result = document.getElementById("customQuoteResult");
  const productSelect = document.getElementById("quoteProduct");
  const finderGuideBox = document.getElementById("quoteFinderGuide");

  function readInquiries() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch (error) {
      return [];
    }
  }

  function writeInquiries(inquiries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inquiries));
  }

  function readFinderGuide() {
    try {
      return JSON.parse(sessionStorage.getItem(FINDER_GUIDE_KEY) || localStorage.getItem(FINDER_GUIDE_KEY) || "null");
    } catch (error) {
      return null;
    }
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function applyProductFromQuery() {
    const product = new URLSearchParams(window.location.search).get("product");
    if (!product || !productSelect) return;

    const option = Array.from(productSelect.options).find((item) => item.value === product || item.textContent === product);
    if (option) {
      productSelect.value = option.value;
    }
  }

  function value(formData, key) {
    return String(formData.get(key) || "").trim();
  }

  function selectedFileSummary(formElement) {
    const input = formElement.querySelector('input[name="referenceImage"]');
    const file = input?.files?.[0];
    if (!file) return "첨부 없음";
    const sizeMb = file.size ? Math.round((file.size / 1024 / 1024) * 10) / 10 : 0;
    return file.name + (sizeMb ? " (" + sizeMb + "MB)" : "");
  }

  function dimensions(formData) {
    const width = value(formData, "width");
    const depth = value(formData, "depth");
    const height = value(formData, "height");
    const parts = [
      width ? "가로 " + width + "mm" : "",
      depth ? "깊이 " + depth + "mm" : "",
      height ? "높이 " + height + "mm" : ""
    ].filter(Boolean);
    return parts.length ? parts.join(" / ") : "미정 - 상담 과정에서 함께 조율 필요";
  }

  function finderGuideText(guide) {
    if (!guide?.sections?.length) return "";
    const lines = [
      "가구 방향 찾기 결과",
      ...guide.sections.map((item) => {
        return "- " + item.category + ": " + item.title + " / " + item.text;
      })
    ];
    if (guide.analysisData?.length) {
      lines.push("");
      lines.push("상담 분석 데이터");
      guide.analysisData.forEach((item) => {
        lines.push("- Q" + item.step + ". " + item.question);
        lines.push("  답변: " + item.answers.join(", "));
        if (item.insights?.length) lines.push("  분석: " + item.insights.join(" "));
      });
    }
    return lines.join("\n");
  }

  function renderFinderGuide() {
    const guide = readFinderGuide();
    if (!finderGuideBox || !guide?.sections?.length) return;

    finderGuideBox.hidden = false;
    finderGuideBox.innerHTML = [
      '<span class="finder-result-label">Finder Result</span>',
      "<h2>가구 방향 찾기 결과</h2>",
      "<p>아래 내용은 확정된 제작안이 아니라, 상담 전에 참고할 수 있는 방향입니다. 문의를 접수하면 관리자도 이 결과를 함께 확인합니다.</p>",
      guide.sampleImage ? '<figure class="finder-sample compact"><img src="' + escapeHtml(guide.sampleImage) + '" alt="추천 원목 수종과 마감 방법 실사 샘플"><figcaption>추천 수종과 마감 느낌을 이해하기 위한 참고용 실사 샘플 이미지입니다.</figcaption></figure>' : "",
      '<div class="finder-guide-list compact">',
      guide.sections.map((item) => [
        '<section class="finder-guide-item">',
        "<span>" + escapeHtml(item.category) + "</span>",
        "<h3>" + escapeHtml(item.title) + "</h3>",
        "<p>" + escapeHtml(item.text) + "</p>",
        "</section>"
      ].join("")).join(""),
      "</div>",
      guide.analysisData?.length ? [
        '<div class="finder-analysis-list compact">',
        "<h3>상담 분석 데이터</h3>",
        guide.analysisData.map((item) => [
          '<section class="finder-analysis-item">',
          "<span>" + escapeHtml(item.step) + "</span>",
          "<h4>" + escapeHtml(item.question) + "</h4>",
          "<p><strong>답변</strong> " + escapeHtml(item.answers.join(", ")) + "</p>",
          item.insights?.length ? "<p><strong>분석</strong> " + escapeHtml(item.insights.join(" ")) + "</p>" : "",
          "</section>"
        ].join("")).join(""),
        "</div>"
      ].join("") : ""
    ].join("");
  }

  function createInquiry(formData) {
    const now = new Date();
    const finderGuide = readFinderGuide();
    const details = [
      "설치 공간: " + (value(formData, "space") || "미정"),
      "검토 중인 사이즈: " + dimensions(formData),
      "참고 이미지: " + selectedFileSummary(form),
      "원목 수종: " + (value(formData, "wood") || "미정"),
      "도장 방향: " + (value(formData, "coating") || "미정"),
      "마감 방법: " + (value(formData, "finish") || "미정"),
      "선호 연락 방법: " + (value(formData, "preferredContact") || "미정"),
      "요청사항: " + value(formData, "message")
    ];

    const guideSummary = finderGuideText(finderGuide);
    if (guideSummary) {
      details.push("");
      details.push(guideSummary);
    }

    return {
      id: "MQ-" + now.getTime().toString(36).toUpperCase(),
      createdAt: now.toISOString(),
      name: value(formData, "name"),
      email: value(formData, "email"),
      phone: value(formData, "phone"),
      preferredContact: value(formData, "preferredContact"),
      product: "주문제작 - " + formData.get("product"),
      budget: formData.get("budget"),
      timeline: value(formData, "timeline"),
      message: details.join("\n"),
      finderGuide: finderGuide || null,
      status: "신규 접수",
      source: "주문제작 견적 문의"
    };
  }

  applyProductFromQuery();
  renderFinderGuide();

  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    const inquiry = createInquiry(formData);
    const inquiries = readInquiries();
    inquiries.unshift(inquiry);
    writeInquiries(inquiries);

    form.reset();
    applyProductFromQuery();
    renderFinderGuide();

    if (result) {
      result.textContent = "견적 문의가 접수되었습니다. 관리자 페이지의 문의 내역에서 가구 방향 찾기 결과와 함께 확인할 수 있습니다.";
    }
  });
})();
