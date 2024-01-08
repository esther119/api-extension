console.log("sw-omnibox.js");
chrome.runtime.onInstalled.addListener(({ reason }) => {
    console.log("chrome.runtime.Reason", reason);
    if (reason === "update") {
      chrome.storage.local.set({
        apiSuggestions: ["Background_Fetch_API", "Document_Object_Model", "Media_Capture_and_Streams_API"],
      }, () => {
        // Retrieve the apiSuggestions and log it
        chrome.storage.local.get("apiSuggestions", (result) => {
          console.log("apiSuggestions", result.apiSuggestions);
        });
      });
    }
  });

const URL_CHROME_EXTENSIONS_DOC =
  "https://developer.mozilla.org/en-US/docs/Web/API/";
const NUMBER_OF_PREVIOUS_SEARCHES = 4;

// chrome.action.onClicked.addListener((tab) => {
//     console.log('Extension button clicked!');
// });

// Display the suggestions after user starts typing
chrome.omnibox.onInputChanged.addListener(async (input, suggest) => {
  await chrome.omnibox.setDefaultSuggestion({
    description: "Enter a Chrome API or choose from past searches",
  });
  const { apiSuggestions } = await chrome.storage.local.get("apiSuggestions");
  console.log("apiSuggestions", apiSuggestions);
  const suggestions = apiSuggestions.map((api) => {
    return { content: api, description: `Open chrome.${api} API` };
  });
  suggest(suggestions);
  console.log("suggest", suggestions);
});

chrome.omnibox.onInputEntered.addListener((input) => {
  chrome.tabs.create({ url: URL_CHROME_EXTENSIONS_DOC + input });
  // Save the latest keyword
  updateHistory(input);
  console.log("open input", input);
});

// Save to local storage
async function updateHistory(input) {
  const { apiSuggestions } = await chrome.storage.local.get("apiSuggestions");
  
  // Add the new 'input' to the beginning of the 'apiSuggestions' array
  apiSuggestions.unshift(input);
    
  // Remove elements from the end of 'apiSuggestions' if it exceeds 'NUMBER_OF_PREVIOUS_SEARCHES'
  apiSuggestions.splice(NUMBER_OF_PREVIOUS_SEARCHES);
  console.log("apiSuggestions updateHistory", apiSuggestions);
  console.log("number of previous searches", NUMBER_OF_PREVIOUS_SEARCHES)
  return chrome.storage.local.set({ apiSuggestions });
}
