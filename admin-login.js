(async function () {
  const form = document.getElementById("adminLoginForm");
  const result = document.getElementById("adminLoginResult");
  const submitButton = form.querySelector('button[type="submit"]');
  const resetButton = document.getElementById("adminResetPassword");

  function messageFor(error) {
    const message = String(error?.message || "").toLowerCase();
    if (message.includes("invalid login credentials")) return "이메일 또는 비밀번호가 올바르지 않습니다. 비밀번호를 잊으셨다면 아래 재설정 버튼을 이용해 주세요.";
    if (message.includes("email not confirmed")) return "이메일 인증이 완료되지 않았습니다. 받은 편지함의 인증 메일을 확인해 주세요.";
    if (message.includes("rate limit") || error?.status === 429) return "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.";
    return "로그인 서버에 연결하지 못했습니다. 인터넷 연결을 확인한 뒤 다시 시도해 주세요.";
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    submitButton.disabled = true;
    result.textContent = "관리자 계정을 확인하고 있습니다…";
    try {
      const { error } = await MokkanBackend.client.auth.signInWithPassword({ email, password });
      if (error) { result.textContent = messageFor(error); return; }
      const profile = await MokkanBackend.profile().catch(() => null);
      if (profile?.role !== "admin") {
        await MokkanBackend.client.auth.signOut();
        result.textContent = "관리자 권한이 없는 계정입니다.";
        return;
      }
      location.replace("./admin.html");
    } finally { submitButton.disabled = false; }
  });

  resetButton.addEventListener("click", async () => {
    const email = String(new FormData(form).get("email") || "").trim();
    if (!email) { result.textContent = "먼저 관리자 이메일을 입력해 주세요."; form.elements.email.focus(); return; }
    resetButton.disabled = true;
    const redirectTo = new URL("./reset-password.html", location.href).href;
    const { error } = await MokkanBackend.client.auth.resetPasswordForEmail(email, { redirectTo });
    result.textContent = error ? messageFor(error) : "비밀번호 재설정 메일을 보냈습니다. 받은 편지함과 스팸함을 확인해 주세요.";
    resetButton.disabled = false;
  });

  const current = await MokkanBackend.user().catch(() => null);
  if (current) {
    const profile = await MokkanBackend.profile().catch(() => null);
    if (profile?.role === "admin") location.replace("./admin.html");
  }
})();
