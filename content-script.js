function extractContent() {
  // extracting all texts under p  tag
  const paragraphs = document.querySelectorAll("p");
  const content = Array.from(paragraphs)
    .map((p) => p.textContent)
    .join("\n");

  console.log(content);
  return content;
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if (msg.from === "popup" && msg.subject === "extractContent") {
    const content = extractContent();
    response({ content: content });
  }
});
