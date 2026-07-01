(function () {
  const form = document.getElementById("loginForm"); const result = document.getElementById("loginResult");
  if (!form) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); result.textContent = "로그인 중입니다…"; const d = new FormData(form);
    const { error } = await MokkanBackend.client.auth.signInWithPassword({ email: String(d.get("email")).trim(), password: String(d.get("password")) });
    if (error) { result.textContent = "로그인할 수 없습니다. 이메일 인증과 비밀번호를 확인해 주세요."; return; }
    result.textContent = "로그인되었습니다."; setTimeout(() => location.href = "./mypage.html", 400);
  });
})();
