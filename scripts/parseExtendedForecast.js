export function parseExtendedForecast(doc, nwsBase) {
  console.log("[parseExtendedForecast] Running…");

  const extendedHeader = doc.querySelector("#seven-day-forecast .panel-heading b")?.textContent || "Extended Forecast";
  console.log("[parseExtendedForecast] Header:", extendedHeader);

  const tombstones = doc.querySelectorAll("#seven-day-forecast-list li.forecast-tombstone");
  console.log("[parseExtendedForecast] Tombstones found:", tombstones.length);

  let forecastHTML = "";
  tombstones.forEach((li, i) => {
    if (i >= 5) return;
    const period = li.querySelector(".period-name")?.textContent || "";
    const shortDesc = li.querySelector(".short-desc")?.textContent || "";
    const tempDesc = li.querySelector(".temp")?.textContent || "";
    const imgTag = li.querySelector("img.forecast-icon");

    let imgHTML = "";
    if (imgTag) {
      let src = imgTag.getAttribute("src");
      if (!src.startsWith("http")) src = nwsBase + src.replace(/^\/?/, "");
      imgHTML = `<img src="${src}" alt="${imgTag.alt}">`;
    }

    forecastHTML += `<div class="forecast-tombstone">${imgHTML}<p><strong>${period}:</strong> ${shortDesc} ${tempDesc}</p></div>`;
  });

  console.log("[parseExtendedForecast] Forecast HTML:", forecastHTML);
  return { extendedHeader, forecastHTML };
}
