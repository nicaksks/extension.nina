chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: "Salvar Página",
    id: "page",
    contexts: ["all"],
  });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: "Deletar Página do Histórico",
    id: "history",
    contexts: ["all"],
  });
});

chrome.contextMenus.onClicked.addListener(function (info) {
  if (info.menuItemId === "page") {
    saveURL();
  }
})

chrome.contextMenus.onClicked.addListener(function (info, tabs) {
  if (info.menuItemId === "history") {
    const title = tabs.title;
    console.log(title)
    deleteOne(title)
  }
})

function deleteOne(title) {
  chrome.storage.sync.remove([title]).then(() => {
    console.log("Deletado coms sucesso.");
  });
};

function saveURL() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

    const title = tabs[0].title;
    const url = tabs[0].url;
    database(title, url);

  });
};

function database(title, url) {
  chrome.storage.sync.set({ [title]: url }).then(() => {
    console.log("Salvo com sucesso.");
  });
};