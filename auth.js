(function () {
  const SESSION_KEY = "mokkanCurrentMember";

  function currentSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY) || "null");
    } catch (error) {
      return null;
    }
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    location.href = location.pathname.includes("/blog/") ? "../login.html" : "./login.html";
  }

  const session = currentSession();
  if (!session) return;

  document.querySelectorAll('a[href$="login.html"]').forEach((link) => {
    link.textContent = "로그아웃";
    link.href = "#logout";
    link.addEventListener("click", function (event) {
      event.preventDefault();
      logout();
    });
  });
})();
