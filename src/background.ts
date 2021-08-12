import manifest from "../manifest.json";

function getCanonicalUrl() {
  function isHTMLLinkElement(el: Element): el is HTMLLinkElement {
    return "href" in el;
  }

  const canonical = document.querySelector('link[rel="canonical"]');
  if (
    canonical === null ||
    !isHTMLLinkElement(canonical) ||
    canonical.href === undefined
  ) {
    throw new Error("canonical URL is unspecified");
  }
  return canonical.href;
}

async function initialize(tabId: number, currentUrl: string) {
  try {
    await chrome.action.disable(tabId);
    const [mainFrame] = await chrome.scripting.executeScript({
      target: { tabId },
      func: getCanonicalUrl,
    });

    if (currentUrl !== mainFrame.result) {
      await chrome.action.enable(tabId);
      await chrome.action.setIcon({ path: manifest.icons });
      return;
    }

    await chrome.action.disable(tabId);
    await chrome.action.setIcon({ path: manifest.action.default_icon });
  } catch (e) {
    return;
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status !== "complete" ||
    tab.active === false ||
    tab.url === undefined
  ) {
    return;
  }
  initialize(tabId, tab.url);
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  if (tab.url === undefined) {
    return;
  }
  initialize(activeInfo.tabId, tab.url);
});

chrome.action.onClicked.addListener((tab) => {
  if (tab.id === undefined) return;
  const tabId = tab.id;
  chrome.scripting.executeScript({
    target: { tabId },
    files: ["move.js"],
  });
});

chrome.runtime.onInstalled.addListener((reason) => {
  checkCommandShortcuts();
});

// Only use this function during the initial install phase. After
// installation the user may have intentionally unassigned commands.
function checkCommandShortcuts() {
  chrome.commands.getAll((commands) => {
    let missingShortcuts = [];

    for (let { name, shortcut } of commands) {
      if (shortcut === "") {
        missingShortcuts.push(name);
      }
    }

    if (missingShortcuts.length > 0) {
      console.log(missingShortcuts);
    }
  });
}
