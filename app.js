(function () {
  const STORAGE_KEY = "mokkanInquiries";
  const MEMBER_KEY = "mokkanMembers";
  const SESSION_KEY = "mokkanCurrentMember";
  const form = document.getElementById("contactForm");
  const result = document.getElementById("contactResult");

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
      return JSON.parse(localStorage.getItem(MEMBER_KEY) || "[]");
    } catch (error) {
      return [];
    }
  }

  function currentSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY) || "null");
    } catch (error) {
      return null;
    }
  }

  function currentMember() {
    const session = currentSession();
    if (!session) return null;
    return readMembers().find((member) => member.id === session.id || member.email === session.email) || null;
  }

  function lockField(name, value) {
    const field = form?.elements[name];
    if (!field || !value) return;
    field.value = value;
    field.readOnly = true;
    field.classList.add("locked-field");
    field.setAttribute("aria-readonly", "true");
  }

  function applyMemberInfo() {
    const member = currentMember();
    if (!member || !form) return;
    form.querySelector(".member-prefill-note")?.remove();
    lockField("name", member.name);
    lockField("email", member.email);
    lockField("phone", member.phone);

    const note = document.createElement("p");
    note.className = "form-note member-prefill-note";
    note.textContent = "로그인한 회원 정보가 자동으로 불러와졌습니다. 기본 정보 수정은 My page에서 가능합니다.";
    form.insertBefore(note, form.firstElementChild);
  }

  function value(formData, key) {
    return String(formData.get(key) || "").trim();
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

  function selectedFileSummary() {
    const input = form.querySelector('input[name="referenceImage"]');
    const file = input?.files?.[0];
    if (!file) return "첨부 없음";
    const sizeMb = file.size ? Math.round((file.size / 1024 / 1024) * 10) / 10 : 0;
    return file.name + (sizeMb ? " (" + sizeMb + "MB)" : "");
  }

  function createInquiry(formData) {
    const now = new Date();
    const details = [
      "설치 공간: " + (value(formData, "space") || "미정"),
      "검토 중인 크기: " + dimensions(formData),
      "선호 수종: " + (value(formData, "wood") || "미정"),
      "선호 색상: " + (value(formData, "color") || "미정"),
      "마감 방법: " + (value(formData, "finish") || "미정"),
      "예시 이미지: " + selectedFileSummary(),
      "추가 요청사항: " + (value(formData, "message") || "없음")
    ];

    return {
      id: "MQ-" + now.getTime().toString(36).toUpperCase(),
      createdAt: now.toISOString(),
      name: value(formData, "name"),
      email: value(formData, "email"),
      phone: value(formData, "phone"),
      product: formData.get("product"),
      budget: formData.get("budget"),
      timeline: value(formData, "timeline"),
      message: details.join("\n"),
      status: "신규 접수",
      source: "홈페이지"
    };
  }

  if (!form) {
    return;
  }

  applyMemberInfo();

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    const inquiry = createInquiry(formData);
    const inquiries = readInquiries();
    inquiries.unshift(inquiry);
    writeInquiries(inquiries);
    const member = currentMember();
    form.reset();
    if (member) applyMemberInfo();

    if (result) {
      result.textContent = "문의가 접수되었습니다. 관리자 페이지에서 접수 내역을 확인할 수 있습니다.";
    }
  });
})();
