chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: "Salvar Página",
    id: "page",
    contexts: ["all"]
  });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: "Deletar Página do Histórico",
    id: "history",
    contexts: ["all"],
    visible: false
  });
});

chrome.contextMenus.onClicked.addListener(function (info) {
  if (info.menuItemId === "page") {
    saveURL();
  }
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, async function (tab) {
    title = tab.title;
    getResult(title)
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tabs) {
  if (info.menuItemId === "history") {
    const title = tabs.title;
    deleteOne(title)
  };
});

async function getResult(title) {
  await chrome.storage.sync.get([title], function (result) {
    if (result[title]) {
      chrome.contextMenus.update("history", {
        title: "Deletar Página do Histórico",
        contexts: ["all"],
        visible: true
      });
    } else {
      chrome.contextMenus.update("history", {
        title: "Deletar Página do Histórico",
        contexts: ["all"],
        visible: false
      });
    };
  });
};

function deleteOne(title) {
  chrome.storage.sync.remove([title]).then(() => {
    chrome.contextMenus.update("history", {
      title: "Deletar Página do Histórico",
      contexts: ["all"],
      visible: false
    });
    console.log("Deletado coms sucesso.");
  });
};

function saveURL() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

    const title = tabs[0].title;
    const url = tabs[0].url;
    database(title, url);

    chrome.contextMenus.update("history", {
      title: "Deletar Página do Histórico",
      contexts: ["all"],
      visible: true
    });
  });
};

function database(title, url) {
  chrome.storage.sync.set({ [title]: url }).then(() => {
    console.log("Salvo com sucesso.");
  });
};