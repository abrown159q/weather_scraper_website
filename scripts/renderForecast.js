export function renderForecast(currentHTML, extendedHeader, forecastHTML) {
  console.log("[renderForecast] Rendering to page");
  const forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = `
    <h3>Current Conditions</h3>
    ${currentHTML}
    <h3>${extendedHeader}</h3>
    ${forecastHTML}
  `;
}

export function renderError() {
  console.error("[renderForecast] Could not load forecast.");
  document.getElementById("forecast").innerText = "Could not load forecast.";
}
