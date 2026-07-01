(function () {
  const config = window.MOKKAN_SUPABASE;
  if (!config || !window.supabase) throw new Error("MOKKAN backend configuration is missing.");

  const client = window.supabase.createClient(config.url, config.publishableKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });

  async function user() {
    const { data, error } = await client.auth.getUser();
    if (error && !/session/i.test(error.message)) throw error;
    return data.user || null;
  }

  async function profile() {
    const current = await user();
    if (!current) return null;
    const { data, error } = await client.from("profiles").select("*").eq("id", current.id).single();
    if (error) throw error;
    return data;
  }

  async function requireUser(redirect = "./login.html") {
    const current = await user();
    if (!current) location.href = redirect;
    return current;
  }

  window.MokkanBackend = Object.freeze({ client, user, profile, requireUser });
})();
