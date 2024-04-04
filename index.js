let scrapedContent = "";

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("scrapeButton")
    .addEventListener("click", function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            files: ["content-script.js"],
          },
          () => {
          
            chrome.tabs.sendMessage(
              tabs[0].id,
              { from: "popup", subject: "extractContent" },
              function (response) {
                if (chrome.runtime.lastError) {
                  // Handle the error
                  console.error(chrome.runtime.lastError.message);
                  document.getElementById("answer").innerText =
                    "Error extracting content.";
                  return;
                }

                if (response && response.content) {
                  scrapedContent = response.content;
                  console.log(scrapedContent); // For debugging
                  document.getElementById("answer").innerText =
                    "Content extracted!";
                } else {
                  document.getElementById("answer").innerText =
                    "No content found.";
                }
              }
            );
          }
        );
      });
    });

  document.getElementById("askButton").addEventListener("click", function () {
    const question = document.getElementById("question").value;
    const askButton = document.getElementById("askButton");
    const answerDiv = document.getElementById("answer");

    askButton.disabled = true;
    askButton.textContent = "Thinking...";

    if (scrapedContent && question) {
      chrome.runtime.sendMessage(
        {
          action: "performQnA",
          content: scrapedContent,
          question: question,
        },
        function (response) {
          // Once a response is received, re-enable buton
          askButton.disabled = false;
          askButton.textContent = "Ask";

          // Handle the response from the background script
          if (response.answer) {
            answerDiv.innerText = response.answer;
          } else if (response.error) {
            answerDiv.innerText = "Error: " + response.error;
          }
        }
      );
    } else {
      answerDiv.innerText =
        "Please scrape content first and ensure question is not empty.";

      askButton.disabled = false;
      askButton.textContent = "Ask";
    }
  });
});
