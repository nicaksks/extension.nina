let show = document.getElementById("show");
let list = document.getElementById("list");
let clear = document.getElementById("clear");

show.addEventListener("click", showURL);
clear.addEventListener("click", clearURL);

function saveURL() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

    const title = tabs[0].title;
    const url = tabs[0].url;
    database(title, url);
    home();

  });
};

async function showURL() {
  const all = await chrome.storage.sync.get();

  if (Object.keys(all).length < 1) {
    bn();
    clear.style.display = "none";
    return list.innerHTML += `<div><img id="nina" src="assets/imgs/1.png"><p>Histórico limpo</p></div>`;
  };

  bn();
  let id = 0;

  Object.entries(all).forEach(([key, value]) => {

    id += 1;
    let title = key + "<br/>";
    let url = value;
    let test = key

    list.innerHTML += `
    <table class="table-cs">
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Ação</th>
        </tr>
        </thead>
        <tbody>
          <tr>
            <td><center class="number">${id}</center></td>
            <td><center><a href="${url}" target="_blank">${title}</center></a></td>
              <td><center><button id="r" class="remove" data-key="${key}">❌</button</center></td>
            </tr>
       </tbody>
    </table>`;

    document.querySelectorAll('#r').forEach(button => {
      button.addEventListener("click", event => {
        chrome.storage.sync.remove([event.target.dataset.key]).then(() => {
          alert("Deletado com sucesso.");
          home();
        });
      });
    });
  });
};

function clearURL() {
  chrome.storage.sync.clear(function () {
    alert("Seu histórico foi limpo.");
    home();
  });
};

function database(title, url) {
  chrome.storage.sync.set({ [title]: url }).then(() => {
    alert("Salvo com sucesso.");
  });
};

function home() {
  return window.location.href = "index.html";
};

function bn() {
  clear.style.display = "inline-block";
  document.getElementById("nina").style.display = "none";
  document.getElementById("text").style.display = "none";
};