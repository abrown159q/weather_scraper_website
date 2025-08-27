async function loadForecast() {
  const url = "https://forecast.weather.gov/MapClick.php?lat=41.675032&lon=-86.251962";
  const nwsBase = "https://forecast.weather.gov/";

  try {
    const response = await fetch(url);
    const html = await response.text();

    // Parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Current conditions
    const currentDiv = doc.querySelector("#current-conditions-body");
    if (currentDiv) {
      // Fix relative image URLs
      currentDiv.querySelectorAll("img").forEach(img => {
        if (!img.src.startsWith("http")) {
          img.src = nwsBase + img.getAttribute("src").replace(/^\/?/, "");
        }
      });
    }
    const currentHTML = currentDiv ? currentDiv.outerHTML : "<p>Current conditions not available</p>";

    // Extended Forecast header
    const extendedHeader = doc.querySelector("#seven-day-forecast .panel-heading b")?.textContent || "Extended Forecast";

    // Forecast tombstones
    const tombstones = doc.querySelectorAll("#seven-day-forecast-list li.forecast-tombstone");
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

    // Insert into page
    const forecastDiv = document.getElementById("forecast");
    forecastDiv.innerHTML = `
      <h3>Current Conditions</h3>
      ${currentHTML}
      <h3>${extendedHeader}</h3>
      ${forecastHTML}
    `;

  } catch (err) {
    document.getElementById("forecast").innerText = "Could not load forecast.";
    console.error(err);
  }
}

loadForecast();
