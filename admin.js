(function () {
  if (sessionStorage.getItem("mokkanAdminAuth") !== "true") {
    location.replace("./admin-login.html");
    return;
  }

  const STORAGE_KEY = "mokkanInquiries";
  const MEMBER_STORAGE_KEY = "mokkanMembers";
  const PORTFOLIO_STORAGE_KEY = "mokkanPortfolio";
  const PRODUCTION_STORAGE_KEY = "mokkanProductionSchedule";
  const FINANCE_STORAGE_KEY = "mokkanFinanceRecords";
  const STATUS_OPTIONS = ["신규 접수", "추가 질문", "견적 검토", "상담 진행", "답변 완료", "보류"];
  const PRODUCTION_STATUS_OPTIONS = ["상담/설계", "목재 준비", "가공", "조립", "마감", "납품 완료"];
  const PRODUCT_ORDER = ["식탁", "책상", "사이드 테이블", "기타 주문 제작 문의"];
  let hideClosed = false;

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

  function readMembers() {
    try {
      return JSON.parse(localStorage.getItem(MEMBER_STORAGE_KEY) || "[]");
    } catch (error) {
      return [];
    }
  }

  function readPortfolioItems() {
    try {
      return JSON.parse(localStorage.getItem(PORTFOLIO_STORAGE_KEY) || "[]");
    } catch (error) {
      return [];
    }
  }

  function readProductionItems() {
    try {
      return JSON.parse(localStorage.getItem(PRODUCTION_STORAGE_KEY) || "[]");
    } catch (error) {
      return [];
    }
  }

  function writeProductionItems(items) {
    localStorage.setItem(PRODUCTION_STORAGE_KEY, JSON.stringify(items));
  }

  function readFinanceItems() {
    try {
      return JSON.parse(localStorage.getItem(FINANCE_STORAGE_KEY) || "[]");
    } catch (error) {
      return [];
    }
  }

  function writeFinanceItems(items) {
    localStorage.setItem(FINANCE_STORAGE_KEY, JSON.stringify(items));
  }

  function writePortfolioItems(items) {
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(items));
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function formatMessage(value) {
    return escapeHtml(value).replaceAll("\n", "<br>");
  }

  function formatDate(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" });
  }

  function formatFullDate(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("ko-KR");
  }

  function formatCurrency(value) {
    return Number(value || 0).toLocaleString("ko-KR") + "원";
  }

  function isThisMonth(value) {
    const now = new Date();
    const date = new Date(value);
    return !Number.isNaN(date.getTime()) && date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  }

  function thisMonthItems(inquiries) {
    const now = new Date();
    return inquiries.filter((item) => {
      const date = new Date(item.createdAt);
      return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
    });
  }

  function countBy(items, key) {
    return items.reduce((acc, item) => {
      const value = item[key] || "미정";
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
  }

  function setText(id, text) {
    const node = document.getElementById(id);
    if (node) node.textContent = text;
  }

  function renderMetrics(inquiries, members, financeItems) {
    const monthItems = thisMonthItems(inquiries);
    const activeCount = inquiries.filter((item) => ["견적 검토", "상담 진행", "추가 질문"].includes(item.status)).length;
    const consultedCount = inquiries.filter((item) => ["견적 검토", "상담 진행", "답변 완료"].includes(item.status)).length;
    const conversion = inquiries.length ? Math.round((consultedCount / inquiries.length) * 100) : 0;
    const budgetCounts = countBy(inquiries, "budget");
    const topBudget = Object.entries(budgetCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
    const monthFinance = financeItems.filter((item) => isThisMonth(item.date));
    const revenue = monthFinance.filter((item) => item.type === "revenue").reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const expense = monthFinance.filter((item) => item.type === "expense").reduce((sum, item) => sum + Number(item.amount || 0), 0);

    setText("metricMonthly", monthItems.length.toString());
    setText("metricActive", activeCount.toString());
    setText("metricConversion", conversion + "%");
    setText("metricBudget", topBudget);
    setText("metricMembers", members.length.toString());
    setText("metricRevenue", formatCurrency(revenue));
    setText("metricExpense", formatCurrency(expense));
    setText("metricProfit", formatCurrency(revenue - expense));
    setText("dashboardDate", new Date().toLocaleDateString("ko-KR"));
  }

  function renderProductBars(inquiries) {
    const target = document.getElementById("productBars");
    if (!target) return;
    const counts = countBy(inquiries, "product");
    const max = Math.max(...Object.values(counts), 1);

    target.innerHTML = PRODUCT_ORDER.map((product) => {
      const count = counts[product] || 0;
      const width = Math.round((count / max) * 100);
      return [
        '<div class="bar-row">',
        '<div><strong>' + product + '</strong><span>' + count + '건</span></div>',
        '<div class="bar"><i style="width: ' + width + '%"></i></div>',
        '</div>'
      ].join("");
    }).join("");
  }

  function renderCustomerTypes(inquiries) {
    const target = document.getElementById("customerTypes");
    if (!target) return;
    const counts = countBy(inquiries, "budget");
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);

    if (!entries.length) {
      target.innerHTML = '<p class="empty-state">아직 예산 데이터가 없습니다.</p>';
      return;
    }

    target.innerHTML = entries.slice(0, 4).map(([label, count]) => {
      return '<div><strong>' + label + '</strong><span>' + count + '건</span></div>';
    }).join("");
  }

  function statusClass(status) {
    if (status === "답변 완료") return "done";
    if (status === "추가 질문" || status === "보류") return "pending";
    return "active";
  }

  function renderTable(inquiries) {
    const tbody = document.getElementById("inquiryRows");
    const empty = document.getElementById("emptyInquiries");
    if (!tbody) return;

    if (!inquiries.length) {
      tbody.innerHTML = "";
      if (empty) empty.hidden = false;
      return;
    }

    if (empty) empty.hidden = true;
    tbody.innerHTML = inquiries.map((item) => {
      const options = STATUS_OPTIONS.map((status) => {
        return '<option value="' + status + '"' + (item.status === status ? " selected" : "") + ">" + status + "</option>";
      }).join("");

      return [
        '<tr>',
        '<td>' + formatDate(item.createdAt) + '</td>',
        '<td><strong>' + item.name + '</strong><br><span class="muted-small">' + item.email + '</span></td>',
        '<td>' + item.product + '</td>',
        '<td>' + formatMessage(item.message) + '<br><span class="muted-small">연락처: ' + escapeHtml(item.phone || "-") + ' · 선호 연락: ' + escapeHtml(item.preferredContact || "-") + ' · 납기: ' + escapeHtml(item.timeline || "-") + '</span></td>',
        '<td>' + (item.budget || "-") + '</td>',
        '<td><span class="status ' + statusClass(item.status) + '">' + item.status + '</span><select class="status-select" data-id="' + item.id + '">' + options + '</select></td>',
        '</tr>'
      ].join("");
    }).join("");
  }

  function renderTasks(inquiries) {
    const target = document.getElementById("priorityTasks");
    if (!target) return;
    const tasks = inquiries.filter((item) => item.status !== "답변 완료").slice(0, 5);

    if (!tasks.length) {
      target.innerHTML = '<li>오늘 처리할 미완료 문의가 없습니다.</li>';
      return;
    }

    target.innerHTML = tasks.map((item) => {
      return '<li><strong>' + item.name + '</strong> ' + item.product + ' 문의 - ' + item.status + '</li>';
    }).join("");
  }

  function renderContentReaction(inquiries) {
    const target = document.getElementById("contentReaction");
    if (!target) return;
    const productCounts = countBy(inquiries, "product");
    const top = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    const suggestions = top ? [
      top + " 선택 가이드 보강",
      top + " 견적 기준 콘텐츠 작성",
      top + " 관리법 콘텐츠 연결"
    ] : [
      "오일 마감과 우레탄 마감",
      "나에게 맞는 원목 찾기",
      "나무와 구조 이야기"
    ];

    target.innerHTML = suggestions.map((item, index) => {
      return '<li><strong>' + (index + 1) + '위</strong> ' + item + '</li>';
    }).join("");
  }

  function renderMembers(members) {
    const tbody = document.getElementById("memberRows");
    const empty = document.getElementById("emptyMembers");
    if (!tbody) return;

    if (!members.length) {
      tbody.innerHTML = "";
      if (empty) empty.hidden = false;
      return;
    }

    if (empty) empty.hidden = true;
    tbody.innerHTML = members.map((member) => {
      return [
        "<tr>",
        "<td>" + formatDate(member.createdAt) + "</td>",
        "<td><strong>" + member.name + "</strong><br><span class=\"muted-small\">" + member.email + " · " + (member.birthDate || "-") + "</span></td>",
        "<td>" + (member.phone || "-") + "<br><span class=\"muted-small\">" + (member.contactMethod || "-") + " 선호</span></td>",
        "<td>" + (member.address || "-") + "</td>",
        "<td>" + (member.interest || "-") + "</td>",
        "<td>" + (member.marketingConsent ? "동의" : "미동의") + "</td>",
        "</tr>"
      ].join("");
    }).join("");
  }

  function renderPortfolioAdmin(items) {
    const tbody = document.getElementById("portfolioAdminRows");
    const empty = document.getElementById("emptyPortfolioAdmin");
    if (!tbody) return;

    if (!items.length) {
      tbody.innerHTML = "";
      if (empty) empty.hidden = false;
      return;
    }

    if (empty) empty.hidden = true;
    tbody.innerHTML = items.map((item) => {
      return [
        "<tr>",
        '<td><div class="cart-product"><img src="' + escapeHtml(item.image || "./assets/mokkan-about-workshop.png") + '" alt="' + escapeHtml(item.title) + '"><strong>' + escapeHtml(item.title) + "</strong></div></td>",
        "<td>" + escapeHtml(item.category) + "</td>",
        "<td>" + escapeHtml(item.description) + "</td>",
        "<td>" + escapeHtml([item.material, item.status].filter(Boolean).join(" · ")) + "</td>",
        '<td><button type="button" class="small-action edit-portfolio" data-id="' + escapeHtml(item.id) + '">수정</button> <button type="button" class="small-action remove-portfolio" data-id="' + escapeHtml(item.id) + '">삭제</button></td>',
        "</tr>"
      ].join("");
    }).join("");
  }

  function dueClass(dueDate, status) {
    if (status === "납품 완료") return "done";
    const due = new Date(dueDate);
    if (Number.isNaN(due.getTime())) return "active";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.ceil((due - today) / 86400000);
    if (diff < 0) return "pending";
    if (diff <= 7) return "active";
    return "done";
  }

  function renderProduction(items) {
    const tbody = document.getElementById("productionRows");
    const empty = document.getElementById("emptyProduction");
    if (!tbody) return;

    const sorted = items.slice().sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    if (!sorted.length) {
      tbody.innerHTML = "";
      if (empty) empty.hidden = false;
      return;
    }

    if (empty) empty.hidden = true;
    tbody.innerHTML = sorted.map((item) => {
      const options = PRODUCTION_STATUS_OPTIONS.map((status) => {
        return '<option value="' + status + '"' + (item.status === status ? " selected" : "") + ">" + status + "</option>";
      }).join("");
      return [
        "<tr>",
        "<td><strong>" + escapeHtml(item.title) + '</strong><br><span class="muted-small">' + escapeHtml(item.client || "-") + "</span></td>",
        "<td>" + formatFullDate(item.startDate) + "</td>",
        '<td><span class="status ' + dueClass(item.dueDate, item.status) + '">' + formatFullDate(item.dueDate) + "</span></td>",
        '<td><select class="status-select production-status-select" data-id="' + escapeHtml(item.id) + '">' + options + "</select></td>",
        "<td>" + escapeHtml(item.memo || "-") + "</td>",
        '<td><button type="button" class="small-action remove-production" data-id="' + escapeHtml(item.id) + '">삭제</button></td>',
        "</tr>"
      ].join("");
    }).join("");
  }

  function renderFinance(items) {
    const tbody = document.getElementById("financeRows");
    const empty = document.getElementById("emptyFinance");
    if (!tbody) return;

    const sorted = items.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
    if (!sorted.length) {
      tbody.innerHTML = "";
      if (empty) empty.hidden = false;
      return;
    }

    if (empty) empty.hidden = true;
    tbody.innerHTML = sorted.map((item) => {
      const label = item.type === "revenue" ? "수익" : "지출";
      const status = item.type === "revenue" ? "done" : "pending";
      return [
        "<tr>",
        "<td>" + formatFullDate(item.date) + "</td>",
        '<td><span class="status ' + status + '">' + label + "</span></td>",
        "<td><strong>" + escapeHtml(item.title) + "</strong></td>",
        "<td>" + formatCurrency(item.amount) + "</td>",
        "<td>" + escapeHtml(item.memo || "-") + "</td>",
        '<td><button type="button" class="small-action remove-finance" data-id="' + escapeHtml(item.id) + '">삭제</button></td>',
        "</tr>"
      ].join("");
    }).join("");
  }

  function exportCsv(inquiries) {
    const header = ["접수일", "이름", "이메일", "연락처", "제품군", "예산", "희망 납기", "상태", "문의 내용"];
    const rows = inquiries.map((item) => [
      item.createdAt,
      item.name,
      item.email,
      item.phone,
      item.product,
      item.budget,
      item.timeline,
      item.status,
      item.message
    ]);
    const csv = [header, ...rows].map((row) => row.map((cell) => '"' + String(cell || "").replace(/"/g, '""') + '"').join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "mokkan-inquiries.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function render() {
    const inquiries = readInquiries();
    const members = readMembers();
    const portfolioItems = readPortfolioItems();
    const productionItems = readProductionItems();
    const financeItems = readFinanceItems();
    const visibleInquiries = hideClosed ? inquiries.filter((item) => item.status !== "답변 완료") : inquiries;
    renderMetrics(inquiries, members, financeItems);
    renderProductBars(inquiries);
    renderCustomerTypes(inquiries);
    renderTable(visibleInquiries);
    renderTasks(inquiries);
    renderContentReaction(inquiries);
    renderMembers(members);
    renderPortfolioAdmin(portfolioItems);
    renderProduction(productionItems);
    renderFinance(financeItems);

    const toggle = document.getElementById("clearClosed");
    if (toggle) {
      toggle.textContent = hideClosed ? "답변 완료 문의 보기" : "답변 완료 문의 숨기기";
    }
  }

  document.addEventListener("change", function (event) {
    if (event.target.matches(".production-status-select")) {
      const items = readProductionItems();
      const item = items.find((entry) => entry.id === event.target.dataset.id);
      if (item) {
        item.status = event.target.value;
        writeProductionItems(items);
        render();
      }
      return;
    }

    if (!event.target.matches(".status-select")) return;
    const inquiries = readInquiries();
    const item = inquiries.find((entry) => entry.id === event.target.dataset.id);
    if (item) {
      item.status = event.target.value;
      writeInquiries(inquiries);
      render();
    }
  });

  document.addEventListener("click", function (event) {
    const editButton = event.target.closest(".edit-portfolio");
    if (editButton) {
      const item = readPortfolioItems().find((entry) => entry.id === editButton.dataset.id);
      const form = document.getElementById("adminPortfolioForm");
      if (!item || !form) return;

      form.elements.id.value = item.id;
      form.elements.title.value = item.title || "";
      form.elements.category.value = item.category || "";
      form.elements.image.value = item.image || "";
      form.elements.description.value = item.description || "";
      form.elements.material.value = item.material || "";
      form.elements.status.value = item.status || "디자인 진행";
      setText("adminPortfolioSubmit", "포트폴리오 수정");
      const cancel = document.getElementById("adminPortfolioCancel");
      if (cancel) cancel.hidden = false;
      document.getElementById("portfolioAdmin")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const removeButton = event.target.closest(".remove-portfolio");
    if (removeButton) {
      const items = readPortfolioItems().filter((item) => item.id !== removeButton.dataset.id);
      writePortfolioItems(items);
      render();
      return;
    }

    const removeProduction = event.target.closest(".remove-production");
    if (removeProduction) {
      const items = readProductionItems().filter((item) => item.id !== removeProduction.dataset.id);
      writeProductionItems(items);
      render();
      return;
    }

    const removeFinance = event.target.closest(".remove-finance");
    if (removeFinance) {
      const items = readFinanceItems().filter((item) => item.id !== removeFinance.dataset.id);
      writeFinanceItems(items);
      render();
      return;
    }
  });

  document.getElementById("productionForm")?.addEventListener("submit", function (event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const item = {
      id: "PD-" + Date.now().toString(36),
      title: String(formData.get("title") || "").trim(),
      client: String(formData.get("client") || "").trim(),
      startDate: formData.get("startDate"),
      dueDate: formData.get("dueDate"),
      status: formData.get("status"),
      memo: String(formData.get("memo") || "").trim()
    };
    const items = readProductionItems();
    items.unshift(item);
    writeProductionItems(items);
    form.reset();
    render();
    setText("productionResult", "제작 일정을 등록했습니다.");
  });

  document.getElementById("financeForm")?.addEventListener("submit", function (event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const item = {
      id: "FN-" + Date.now().toString(36),
      date: formData.get("date"),
      type: formData.get("type"),
      title: String(formData.get("title") || "").trim(),
      amount: Number(formData.get("amount") || 0),
      memo: String(formData.get("memo") || "").trim()
    };
    const items = readFinanceItems();
    items.unshift(item);
    writeFinanceItems(items);
    form.reset();
    render();
    setText("financeResult", "수익/지출 내역을 등록했습니다.");
  });

  document.getElementById("adminPortfolioForm")?.addEventListener("submit", function (event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const editId = String(formData.get("id") || "").trim();
    const item = {
      id: editId || "PF-" + Date.now().toString(36),
      title: String(formData.get("title") || "").trim(),
      category: String(formData.get("category") || "").trim(),
      image: String(formData.get("image") || "").trim() || "./assets/mokkan-about-workshop.png",
      description: String(formData.get("description") || "").trim(),
      material: String(formData.get("material") || "").trim(),
      status: formData.get("status")
    };

    const items = readPortfolioItems();
    const existingIndex = items.findIndex((entry) => entry.id === editId);
    if (existingIndex >= 0) {
      items[existingIndex] = item;
    } else {
      items.unshift(item);
    }
    writePortfolioItems(items);
    form.reset();
    setText("adminPortfolioSubmit", "포트폴리오 등록");
    const cancel = document.getElementById("adminPortfolioCancel");
    if (cancel) cancel.hidden = true;
    render();

    const result = document.getElementById("adminPortfolioResult");
    if (result) result.textContent = existingIndex >= 0 ? "포트폴리오 작업을 수정했습니다." : "포트폴리오에 새 작업을 등록했습니다.";
  });

  document.getElementById("adminPortfolioCancel")?.addEventListener("click", function () {
    document.getElementById("adminPortfolioForm")?.reset();
    setText("adminPortfolioSubmit", "포트폴리오 등록");
    this.hidden = true;
    setText("adminPortfolioResult", "");
  });

  document.getElementById("exportCsv")?.addEventListener("click", function () {
    exportCsv(readInquiries());
  });

  document.getElementById("clearClosed")?.addEventListener("click", function () {
    hideClosed = !hideClosed;
    render();
  });

  document.getElementById("adminLogout")?.addEventListener("click", function () {
    sessionStorage.removeItem("mokkanAdminAuth");
    location.href = "./admin-login.html";
  });

  render();
})();
