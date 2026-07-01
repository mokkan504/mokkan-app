(function () {
  const form = document.getElementById("adminLoginForm");
  const result = document.getElementById("adminLoginResult");

  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    const id = formData.get("adminId").trim();
    const password = formData.get("adminPassword");

    if (id === "admin" && password === "mokkan2026") {
      sessionStorage.setItem("mokkanAdminAuth", "true");
      location.href = "./admin.html";
      return;
    }

    if (result) result.textContent = "관리자 계정 정보가 올바르지 않습니다.";
  });
})();
