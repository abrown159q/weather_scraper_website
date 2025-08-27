async function loadForecast() {
  const url = "https://forecast.weather.gov/MapClick.php?lat=41.675032&lon=-86.251962";

  try {
    const response = await fetch(url);
    const html = await response.text();

    // Parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Current conditions
    const currentHeader = doc.querySelector("#current_conditions-summary h2")?.textContent || "Current Conditions";
    const temp = doc.querySelector("#current_conditions-summary p.myforecast-current-lrg")?.textContent || "";
    const weather = doc.querySelector("#current_conditions-summary p.myforecast-current")?.textContent || "";
    const wind = Array.from(doc.querySelectorAll("#current_conditions_detail tr th"))
                     .map(th => th.textContent)
                     .find(t => t.includes("Wind"))
                     ? doc.querySelector("#current_conditions_detail tr td")?.textContent
                     : "";

    // Extended Forecast header
    const extendedHeader = doc.querySelector("#seven-day-forecast .panel-heading b")?.textContent || "Extended Forecast";

    // Forecast tombstones
    const tombstones = doc.querySelectorAll("#seven-day-forecast-list li.forecast-tombstone");
    let forecastHTML = "";
    tombstones.forEach((li, i) => {
      if (i >= 5) return; // limit to next 5 periods
      const period = li.querySelector(".period-name")?.textContent || "";
      const shortDesc = li.querySelector(".short-desc")?.textContent || "";
      const tempDesc = li.querySelector(".temp")?.textContent || "";
      forecastHTML += `<p><strong>${period}:</strong> ${shortDesc} ${tempDesc}</p>`;
    });

    // Display
    const forecastDiv = document.getElementById("forecast");
    forecastDiv.innerHTML = `
      <h3>${currentHeader}</h3>
      <p>${temp} - ${weather} - ${wind}</p>
      <h3>${extendedHeader}</h3>
      ${forecastHTML}
    `;

  } catch (err) {
    document.getElementById("forecast").innerText = "Could not load forecast.";
  }
}

loadForecast();
