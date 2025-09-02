// scripts/ohcAnimation.js

export async function initOHCAnimation(divId) {
  const baseUrl = "https://www.ospo.noaa.gov/Visualization01/cData/Blended/OHC/NATL/OHC-PNG";
  const today = new Date();
  const frames = [];

  // Generate last 10 calendar days' URLs
  for (let i = 9; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");

    const url = `${baseUrl}/OHC-PNG_NATL_${yyyy}${mm}${dd}.png`;
    frames.push(url);
  }

  // Create container and image element
  const container = document.getElementById(divId);
  container.innerHTML = "";
  const img = document.createElement("img");
  img.style.width = "100%"; // adjust as needed
  container.appendChild(img);

  // Animation loop
  let idx = 0;
  setInterval(() => {
    img.src = frames[idx];
    idx = (idx + 1) % frames.length;
  }, 1000); // 1 second per frame
}
