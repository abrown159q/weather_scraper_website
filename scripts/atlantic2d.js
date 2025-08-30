// scripts/atlantic2d.js

export async function initAtlantic2D() {
  const url = "https://www.nhc.noaa.gov/gtwo.php?basin=atlc&basin=atlc&fdays=2";
  console.log("[Atlantic2D] Fetching:", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Find the image
    const img = doc.querySelector("#twofig2d");
    if (!img) {
      throw new Error("Image #twofig2d not found in NHC page.");
    }

    // Build absolute URL from relative src
    const pageUrl = new URL(url);
    const imgSrc = new URL(img.getAttribute("src"), pageUrl).href;

    const scrapedData = {
      id: img.id,
      name: img.getAttribute("name"),
      alt: img.getAttribute("alt"),
      src: imgSrc,
      usemap: img.getAttribute("usemap"),
      width: img.getAttribute("width"),
      border: img.getAttribute("border")
    };

    // Scrape the associated map
    let areas = [];
    const mapName = scrapedData.usemap?.replace("#", "");
    const mapElement = doc.querySelector(`map[name="${mapName}"]`);
    if (mapElement) {
      const areaElements = mapElement.querySelectorAll("area");
      areas = Array.from(areaElements).map(a => ({
        shape: a.getAttribute("shape"),
        coords: a.getAttribute("coords"),
        href: a.href,
        onmouseover: a.getAttribute("onmouseover"),
        onmouseout: a.getAttribute("onmouseout")
      }));
    }
    scrapedData.areas = areas;

    console.log("[Atlantic2D] Scraped Data:", scrapedData);

    // Update the debug.html image to use the real NHC src
    const localImg = document.getElementById("twofig2d");
    if (localImg) {
      localImg.src = scrapedData.src;
      console.log("[Atlantic2D] Updated #twofig2d src:", scrapedData.src);
    }

    return scrapedData;
  } catch (err) {
    console.error("[Atlantic2D] Error:", err);
    throw err;
  }
}
