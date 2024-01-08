console.log("sw-tips.js");

// Fetch tip & save in storage
const updateTip = async () => {
  console.log("updateTip function called")
  const response = await fetch("https://extension-tips.glitch.me/tips.json");
  const tips = await response.json();
  console.log("tips", tips);
  const randomIndex = Math.floor(Math.random() * tips.length);
  console.log("tip index", tips[randomIndex]);
  return chrome.storage.local.set({ tip: tips[randomIndex] });
};

const ALARM_NAME = "tip";

// Check if alarm exists to avoid resetting the timer.
// The alarm might be removed when the browser session restarts.
async function createAlarm() {
  const alarm = await chrome.alarms.get(ALARM_NAME);
  console.log("create alarm", alarm);
  if (typeof alarm === "undefined") {
    chrome.alarms.create(ALARM_NAME, {
      delayInMinutes: 1,
      periodInMinutes: 1440, //create a daily alarm (every 24 hours)
    });
    updateTip();
  }
}

createAlarm();

// Update tip once a day
chrome.alarms.onAlarm.addListener(updateTip);
// When any alarm triggers, the function updateTip is called.

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.greeting === "tip") {
    chrome.storage.local.get("tip").then(sendResponse); // random output from the https://extension-tips.glitch.me/tips.json 
    console.log("send tip to service worker"); // sendResponse is a function here, not the response data itself.
    return true;
  }
});

// log tip
async function logTip() {
  try {
    const data = await chrome.storage.local.get("tip");
    console.log("Log Tip:", data.tip);
  } catch (error) {
    console.error("Error retrieving tip:", error);
  }
}

logTip();
