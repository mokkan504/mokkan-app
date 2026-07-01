(function () {
  const MEMBER_KEY = "mokkanMembers";
  const SESSION_KEY = "mokkanCurrentMember";
  const INQUIRY_KEY = "mokkanInquiries";
  const CART_KEY = "mokkanCart";

  const gate = document.getElementById("mypageGate");
  const content = document.getElementById("mypageContent");
  const history = document.getElementById("mypageHistory");
  const form = document.getElementById("mypageForm");
  const result = document.getElementById("mypageResult");

  function readJson(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch (error) {
      return fallback;
    }
  }

  function writeMembers(members) {
    localStorage.setItem(MEMBER_KEY, JSON.stringify(members));
  }

  function currentSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY) || "null");
    } catch (error) {
      return null;
    }
  }

  function findMember() {
    const session = currentSession();
    if (!session) return null;
    return readJson(MEMBER_KEY, []).find((member) => member.id === session.id || member.email === session.email) || null;
  }

  function formatDate(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("ko-KR");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function fillForm(member) {
    form.elements.name.value = member.name || "";
    form.elements.birthDate.value = member.birthDate || "";
    form.elements.email.value = member.email || "";
    form.elements.phone.value = member.phone || "";
    form.elements.address.value = member.address || "";
    form.elements.interest.value = member.interest || "가구 제작 문의";
    form.elements.contactMethod.value = member.contactMethod || "이메일";
    form.elements.marketingConsent.checked = Boolean(member.marketingConsent);
  }

  function renderSummary(member) {
    const target = document.getElementById("memberSummary");
    if (!target) return;
    target.innerHTML = [
      "<p><strong>" + escapeHtml(member.name) + "</strong></p>",
      "<p>" + escapeHtml(member.email) + "</p>",
      "<p>" + escapeHtml(member.phone || "-") + "</p>",
      "<p>관심 분야: " + escapeHtml(member.interest || "-") + "</p>",
      "<p>선호 연락: " + escapeHtml(member.contactMethod || "-") + "</p>"
    ].join("");
  }

  function renderCart() {
    const target = document.getElementById("mypageCart");
    if (!target) return;
    const items = readJson(CART_KEY, []);
    if (!items.length) {
      target.innerHTML = '<p class="empty-state">장바구니가 비어 있습니다.</p>';
      return;
    }
    target.innerHTML = items.slice(0, 3).map((item) => {
      return '<p><strong>' + escapeHtml(item.name) + '</strong><br><span class="muted-small">' + escapeHtml(item.option || item.type || "") + " · " + item.quantity + "개</span></p>";
    }).join("");
  }

  function renderInquiries(member) {
    const rows = document.getElementById("mypageInquiryRows");
    const empty = document.getElementById("emptyMypageInquiries");
    if (!rows) return;
    const inquiries = readJson(INQUIRY_KEY, []).filter((item) => item.email === member.email);

    if (!inquiries.length) {
      rows.innerHTML = "";
      if (empty) empty.hidden = false;
      return;
    }

    if (empty) empty.hidden = true;
    rows.innerHTML = inquiries.map((item) => [
      "<tr>",
      "<td>" + formatDate(item.createdAt) + "</td>",
      "<td>" + escapeHtml(item.product) + "</td>",
      "<td>" + escapeHtml(item.message) + "</td>",
      "<td>" + escapeHtml(item.budget || "-") + "</td>",
      '<td><span class="status active">' + escapeHtml(item.status || "신규 접수") + "</span></td>",
      "</tr>"
    ].join("")).join("");
  }

  function boot() {
    const member = findMember();
    if (!member) {
      if (gate) gate.hidden = false;
      if (content) content.hidden = true;
      if (history) history.hidden = true;
      return;
    }

    if (gate) gate.hidden = true;
    if (content) content.hidden = false;
    if (history) history.hidden = false;
    fillForm(member);
    renderSummary(member);
    renderCart();
    renderInquiries(member);
  }

  form?.addEventListener("submit", function (event) {
    event.preventDefault();
    const member = findMember();
    if (!member) return;

    const members = readJson(MEMBER_KEY, []);
    const index = members.findIndex((item) => item.id === member.id || item.email === member.email);
    if (index < 0) return;

    const formData = new FormData(form);
    members[index] = {
      ...members[index],
      name: String(formData.get("name") || "").trim(),
      birthDate: formData.get("birthDate"),
      phone: String(formData.get("phone") || "").trim(),
      address: String(formData.get("address") || "").trim(),
      interest: formData.get("interest"),
      contactMethod: formData.get("contactMethod"),
      marketingConsent: formData.get("marketingConsent") === "on"
    };
    writeMembers(members);
    const session = {
      id: members[index].id,
      name: members[index].name,
      email: members[index].email,
      loggedInAt: new Date().toISOString()
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    renderSummary(members[index]);
    if (result) result.textContent = "회원 정보가 수정되었습니다.";
  });

  document.getElementById("memberLogout")?.addEventListener("click", function () {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    location.href = "./login.html";
  });

  boot();
})();
