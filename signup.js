(function () {
  const STORAGE_KEY = "mokkanMembers";
  const SESSION_KEY = "mokkanCurrentMember";
  const form = document.getElementById("signupForm");
  const result = document.getElementById("signupResult");

  function readMembers() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch (error) {
      return [];
    }
  }

  function writeMembers(members) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  }

  async function hashPassword(password) {
    if (!window.crypto || !crypto.subtle) {
      let hash = 0;
      for (let i = 0; i < password.length; i += 1) {
        hash = ((hash << 5) - hash) + password.charCodeAt(i);
        hash |= 0;
      }
      return "fallback-" + Math.abs(hash).toString(16);
    }
    const bytes = new TextEncoder().encode(password);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  async function createMember(formData) {
    const now = new Date();
    return {
      id: "MB-" + now.getTime().toString(36).toUpperCase(),
      createdAt: now.toISOString(),
      name: formData.get("name").trim(),
      birthDate: formData.get("birthDate"),
      email: formData.get("email").trim(),
      phone: formData.get("phone").trim(),
      address: formData.get("address").trim(),
      interest: formData.get("interest"),
      contactMethod: formData.get("contactMethod"),
      passwordHash: await hashPassword(formData.get("password")),
      privacyConsent: formData.get("privacyConsent") === "on",
      marketingConsent: formData.get("marketingConsent") === "on",
      source: "회원가입"
    };
  }

  if (!form) return;

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    const email = formData.get("email").trim();
    const members = readMembers();
    const existing = members.find((member) => member.email === email);

    if (existing) {
      if (result) result.textContent = "이미 가입된 이메일입니다.";
      return;
    }

    const member = await createMember(formData);
    members.unshift(member);
    writeMembers(members);
    const session = {
      id: member.id,
      name: member.name,
      email: member.email,
      loggedInAt: new Date().toISOString()
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    form.reset();

    if (result) {
      result.textContent = "회원가입이 완료되었습니다. My page로 이동합니다.";
    }
    setTimeout(() => {
      location.href = "./mypage.html";
    }, 700);
  });
})();
