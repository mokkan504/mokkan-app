(async function () {
  if (!window.MokkanBackend) return;
  const current = await MokkanBackend.user().catch(() => null);
  document.querySelectorAll('a[href="./login.html"]').forEach((link) => { if (current) link.textContent = "로그아웃"; });
  document.addEventListener("click", async (event) => {
    const link = event.target.closest('a[href="./login.html"]');
    if (!link || !current) return; event.preventDefault(); await MokkanBackend.client.auth.signOut(); location.href = "./index.html";
  });
})();
