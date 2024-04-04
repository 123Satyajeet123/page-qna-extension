//----UNCOMMENT LINE BELOW AND THEN ADD YOUR HUGGING FACE API KEY----------------

// const HUGGING_FACE_API_KEY = **************************** ;
const HUGGING_FACE_ENDPOINT =
  "https://api-inference.huggingface.co/models/deepset/roberta-base-squad2";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "performQnA") {
    const content = request.content;
    const question = request.question;

    const requestBody = {
      inputs: {
        question: question,
        context: content,
      },
    };

    fetch(HUGGING_FACE_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        sendResponse({ answer: data["answer"] });
      })
      .catch((error) => {
        console.error("Error calling Hugging Face API:", error);
        sendResponse({ error: "Failed to get an answer. " + error.message });
      });

    return true;
  }
});
