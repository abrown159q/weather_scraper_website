function cleanText(el) {
  if (!el) return "";
  // Replace <br> with spaces and normalize whitespace
  return el.innerHTML.replace(/<br\s*\/?>/gi, " ").replace(/\s+/g, " ").trim();
}

export function parseExtendedForecast(doc, nwsBase, log = console.log) {
  log("[parseExtendedForecast] Running…");

  const forecastList = doc.querySelectorAll("#seven-day-forecast-list li.forecast-tombstone");
  log("[parseExtendedForecast] Found tombstones: " + forecastList.length);

  const forecasts = [];

  forecastList.forEach((li, i) => {
    log(`[parseExtendedForecast] Parsing tombstone #${i + 1}`);
    const container = li.querySelector(".tombstone-container");
    if (!container) {
      log(`[parseExtendedForecast] ⚠ No .tombstone-container for tombstone #${i + 1}`);
      return;
    }

    const period = container.querySelector(".period-name")?.textContent.trim() || "";
    const shortDesc = cleanText(container.querySelector(".short-desc"));
    const temperature = container.querySelector(".temp")?.textContent.trim() || "";

    const imgTag = container.querySelector("img.forecast-icon");
    let iconUrl = "";
    let iconAlt = "";
    if (imgTag) {
      let src = imgTag.getAttribute("src");
      if (!src.startsWith("http")) src = nwsBase + src.replace(/^\/?/, "");
      iconUrl = src;
      iconAlt = imgTag.alt?.trim() || "";
    }

    const forecastObj = { period, shortDesc, temperature, iconUrl, iconAlt };
    forecasts.push(forecastObj);
    log(`[parseExtendedForecast] Extracted: ${JSON.stringify(forecastObj)}`);
  });

  // Generate simple HTML for backward compatibility
  const extendedHeader = "Extended Forecast";
  const forecastHTML = forecasts.map(f => `
    <div class="forecast-item">
      <img src="${f.iconUrl}" alt="${f.iconAlt}">
      <p class="period"><strong>${f.period}</strong></p>
      <p class="short">${f.shortDesc}</p>
      <p class="temp">${f.temperature}</p>
    </div>
  `).join("");

  log("[parseExtendedForecast] Finished parsing, total items: " + forecasts.length);

  return { forecasts, extendedHeader, forecastHTML };
}
