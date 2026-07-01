(function () {
  const form = document.getElementById("signupForm");
  const result = document.getElementById("signupResult");
  if (!form) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); result.textContent = "가입 처리 중입니다…";
    const d = new FormData(form); const email = String(d.get("email")).trim();
    try {
      const { error } = await MokkanBackend.client.auth.signUp({
        email, password: String(d.get("password")),
        options: { emailRedirectTo: location.origin + location.pathname.replace("signup.html", "login.html"), data: {
          name: String(d.get("name")).trim(), birth_date: d.get("birthDate"), phone: String(d.get("phone")).trim(),
          address: String(d.get("address")).trim(), interest: d.get("interest"), contact_method: d.get("contactMethod"),
          marketing_consent: d.get("marketingConsent") === "on"
        }}
      });
      if (error) throw error; form.reset(); result.textContent = "확인 이메일을 보냈습니다. 이메일 인증 후 로그인해 주세요.";
    } catch (error) { result.textContent = "가입할 수 없습니다: " + error.message; }
  });
})();
