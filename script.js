canva.initialize(async (app) => {
  const scanButton = document.getElementById("scan-button");
  const insertButton = document.getElementById("insert-toc-button");
  const headingsList = document.getElementById("headings-list");
  let headings = [];

  scanButton.addEventListener("click", async () => {
    try {
      const content = await app.content.get();
      headings = [];

      content.pages.forEach(page => {
        page.elements.forEach(el => {
          if (el.type === "TEXT" && el.text) {
            const size = el.style?.fontSize || 0;
            const weight = el.style?.fontWeight || "normal";
            if (size >= 20 || weight === "bold") {
              headings.push(el.text);
            }
          }
        });
      });

      if (headings.length > 0) {
        headingsList.innerHTML = headings.map(h => `<div>• ${h}</div>`).join("");
        insertButton.style.display = "block";
      } else {
        headingsList.innerHTML = "<em>No headings found. Try using larger font sizes.</em>";
      }
    } catch (err) {
      headingsList.innerHTML = "<em>Error scanning design</em>";
      console.error("Scan error:", err);
    }
  });

  insertButton.addEventListener("click", async () => {
    if (headings.length === 0) return;

    const tocText = "Table of Contents\\n\\n" + headings.map((h, i) => `${i + 1}. ${h}`).join("\\n");

    try {
      await app.content.insertElement({
        type: "TEXT",
        text: tocText,
        style: {
          fontSize: 18,
          fontWeight: "bold"
        }
      });
      alert("✅ Table of Contents added to your design!");
    } catch (err) {
      console.error("Insert error:", err);
      alert("⚠️ Failed to insert ToC");
    }
  });
});
