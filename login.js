(function () {
  const MEMBER_KEY = "mokkanMembers";
  const SESSION_KEY = "mokkanCurrentMember";
  const form = document.getElementById("loginForm");
  const result = document.getElementById("loginResult");

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

  function readMembers() {
    try {
      return JSON.parse(localStorage.getItem(MEMBER_KEY) || "[]");
    } catch (error) {
      return [];
    }
  }

  if (!form) return;

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    const email = formData.get("email").trim();
    const passwordHash = await hashPassword(formData.get("password"));
    const member = readMembers().find((item) => item.email === email && item.passwordHash === passwordHash);

    if (!member) {
      if (result) result.textContent = "이메일 또는 비밀번호가 올바르지 않습니다.";
      return;
    }

    const session = {
      id: member.id,
      name: member.name,
      email: member.email,
      loggedInAt: new Date().toISOString()
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    if (result) result.textContent = member.name + "님, 로그인되었습니다.";
    setTimeout(() => {
      location.href = "./mypage.html";
    }, 600);
  });
})();
