export function parseCurrentConditions(doc, nwsBase) {
  console.log("[parseCurrentConditions] Running…");
  const currentDiv = doc.querySelector("#current-conditions-body");
  if (currentDiv) {
    currentDiv.querySelectorAll("img").forEach(img => {
      if (!img.src.startsWith("http")) {
        img.src = nwsBase + img.getAttribute("src").replace(/^\/?/, "");
      }
    });
    console.log("[parseCurrentConditions] Extracted:", currentDiv.outerHTML);
    return currentDiv.outerHTML;
  }
  console.warn("[parseCurrentConditions] Current conditions not found.");
  return "<p>Current conditions not available</p>";
}
