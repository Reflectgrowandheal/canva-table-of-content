const scanButton = document.getElementById("scan-button");
const insertButton = document.getElementById("insert-toc-button");
const headingsList = document.getElementById("headings-list");
let headings = [];

scanButton.addEventListener("click", async () => {
  const design = await window.canva.design.getDesign();
  headings = [];

  for (const page of design.pages) {
    for (const element of page.elements) {
      if (element.type === "TEXT" && element.text && element.style?.fontSize >= 24) {
        headings.push(element.text);
      }
    }
  }

  headingsList.innerHTML = headings.map(h => `<div>• ${h}</div>`).join("");
  insertButton.style.display = "block";
});

insertButton.addEventListener("click", async () => {
  if (headings.length === 0) return;

  const tocText = headings.map((h, i) => `${i + 1}. ${h}`).join("\n");

  await window.canva.design.insertElement({
    type: "TEXT",
    text: tocText,
    style: {
      fontSize: 18,
      fontWeight: "bold"
    }
  });

  alert("Table of Contents inserted into your design!");
});
