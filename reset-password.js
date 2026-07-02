(function () {
  const form = document.getElementById("resetPasswordForm");
  const result = document.getElementById("resetPasswordResult");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const password = String(data.get("password") || "");
    if (password !== String(data.get("passwordConfirm") || "")) { result.textContent = "두 비밀번호가 일치하지 않습니다."; return; }
    const button = form.querySelector("button"); button.disabled = true;
    const { error } = await MokkanBackend.client.auth.updateUser({ password });
    if (error) { result.textContent = "링크가 만료되었거나 비밀번호 조건을 충족하지 않습니다. 로그인 페이지에서 재설정 메일을 다시 요청해 주세요."; button.disabled = false; return; }
    result.textContent = "비밀번호가 변경되었습니다. 로그인 페이지로 이동합니다.";
    setTimeout(() => location.replace("./admin-login.html"), 1000);
  });
})();
