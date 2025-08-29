export async function fetchForecast(url) {
  try {
    console.log("[fetchForecast] Fetching:", url);
    const response = await fetch(url);
    const text = await response.text();
    console.log("[fetchForecast] Raw HTML length:", text.length);
    return text;
  } catch (err) {
    console.error("[fetchForecast] Error:", err);
    throw err;
  }
}
