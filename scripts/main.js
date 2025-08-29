import { fetchForecast } from "./fetchForecast.js";
import { parseCurrentConditions } from "./parseCurrentConditions.js";
import { parseExtendedForecast } from "./parseExtendedForecast.js";
import { renderForecast, renderError } from "./renderForecast.js";

async function loadForecast() {
  const url = "https://forecast.weather.gov/MapClick.php?lat=41.675032&lon=-86.251962";
  const nwsBase = "https://forecast.weather.gov/";

  console.log("[main] Starting forecast load…");

  try {
    const html = await fetchForecast(url);
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const currentHTML = parseCurrentConditions(doc, nwsBase);
    const { extendedHeader, forecastHTML } = parseExtendedForecast(doc, nwsBase);

    renderForecast(currentHTML, extendedHeader, forecastHTML);
  } catch (err) {
    renderError();
  }
}

loadForecast();
