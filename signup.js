(function () {
  const form = document.getElementById("signupForm");
  const result = document.getElementById("signupResult");
  if (!form) return;
  const password = form.elements.password;
  const passwordConfirm = form.elements.passwordConfirm;

  function validatePasswords() {
    const matches = password.value === passwordConfirm.value;
    passwordConfirm.setCustomValidity(matches ? "" : "비밀번호가 일치하지 않습니다.");
    return matches;
  }

  password.addEventListener("input", validatePasswords);
  passwordConfirm.addEventListener("input", validatePasswords);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validatePasswords()) {
      result.textContent = "비밀번호와 비밀번호 확인이 일치하지 않습니다.";
      passwordConfirm.reportValidity();
      return;
    }
    result.textContent = "가입 처리 중입니다…";
    const d = new FormData(form); const email = String(d.get("email")).trim();
    try {
      const { error } = await MokkanBackend.client.auth.signUp({
        email, password: String(d.get("password")),
        options: { emailRedirectTo: location.origin + location.pathname.replace("signup.html", "login.html"), data: {
          name: String(d.get("name")).trim(), birth_date: d.get("birthDate"), phone: String(d.get("phone")).replace(/\D/g, ""),
          address: String(d.get("address")).trim(), interest: d.get("interest"), contact_method: d.get("contactMethod"),
          marketing_consent: d.get("marketingConsent") === "on"
        }}
      });
      if (error) throw error; form.reset(); result.textContent = "확인 이메일을 보냈습니다. 이메일 인증 후 로그인해 주세요.";
    } catch (error) { result.textContent = "가입할 수 없습니다: " + error.message; }
  });
})();
