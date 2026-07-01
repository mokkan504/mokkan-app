(async function () {
  const loginLinks = document.querySelectorAll('a[href="./login.html"]');
  const signupLinks = document.querySelectorAll('a[href="./signup.html"]');

  function hasStoredSession() {
    try {
      const stored = JSON.parse(localStorage.getItem("sb-qmdopiammghynxpvrdol-auth-token") || "null");
      return Boolean(stored?.access_token);
    } catch (error) {
      return false;
    }
  }

  function renderMemberNavigation(signedIn) {
    loginLinks.forEach((link) => { link.textContent = signedIn ? "로그아웃" : "로그인"; });
    signupLinks.forEach((link) => { link.hidden = signedIn; });
  }

  // Apply the locally persisted state before loading remote authentication code.
  // This prevents the navigation from reflowing after the first paint.
  renderMemberNavigation(hasStoredSession());

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        if (existing.dataset.loaded === "true" || (src.includes("supabase-js") && window.supabase)) return resolve();
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.addEventListener("load", () => { script.dataset.loaded = "true"; resolve(); }, { once: true });
      script.addEventListener("error", reject, { once: true });
      document.head.appendChild(script);
    });
  }

  try {
    if (!window.supabase) await loadScript("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.102.0/dist/umd/supabase.min.js");
    if (!window.MOKKAN_SUPABASE) await loadScript("./supabase-config.js");
    if (!window.MokkanBackend) await loadScript("./backend.js");
  } catch (error) {
    console.error("MOKKAN authentication could not be loaded.", error);
    return;
  }

  const current = await MokkanBackend.user().catch(() => null);
  renderMemberNavigation(Boolean(current));
  document.addEventListener("click", async (event) => {
    const link = event.target.closest('a[href="./login.html"]');
    if (!link || !current) return; event.preventDefault(); await MokkanBackend.client.auth.signOut(); location.href = "./index.html";
  });
})();
