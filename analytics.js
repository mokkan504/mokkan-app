(function () {
  const config = window.MOKKAN_SUPABASE;
  if (!config || navigator.doNotTrack === "1") return;

  try {
    const visitorKey = "mokkanAnalyticsVisitor";
    let visitorId = localStorage.getItem(visitorKey);
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem(visitorKey, visitorId);
    }

    const referrer = document.referrer ? new URL(document.referrer).hostname : "direct";
    const width = window.innerWidth;
    const device = width < 640 ? "mobile" : width < 1024 ? "tablet" : "desktop";

    fetch(`${config.url}/rest/v1/rpc/track_page_view`, {
      method: "POST",
      keepalive: true,
      headers: {
        apikey: config.publishableKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        p_path: location.pathname.replace("/mokkan-app", "") || "/",
        p_referrer: referrer,
        p_visitor_id: visitorId,
        p_device: device
      })
    }).catch(() => {});
  } catch (error) {
    // Analytics must never interrupt the customer experience.
  }
})();
