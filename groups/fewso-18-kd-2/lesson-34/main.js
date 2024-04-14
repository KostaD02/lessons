const searchDisplay = document.querySelector("#searchDisplay");
const searchInput = document.querySelector("#searchInput");
const actionsBtns = document.querySelectorAll("span[data-action]");

const audio = new Audio();

const config = {
  BASE_API_URL_DICTIONARY: "https://api.dictionaryapi.dev/api/v2/entries/en",
  KEY_STORAGE_DICTIONARY: "DICTIONARY",
  cache: [],
};

actionsBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    const action = this.getAttribute("data-action");
    switch (action) {
      case "search": {
        search(searchInput.value);
        break;
      }
      case "clear": {
        clear();
        break;
      }
      default: {
        displayAlert("Incorrect action", "error");
        break;
      }
    }
  });
});

searchInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    search(this.value);
  }
});

loadCache();

async function search(word = "") {
  word = word.trim();
  if (word === "") {
    displayAlert("Word can't be empty", "error", "Fill input");
    return;
  }

  searchInput.value = "";

  if (config.cache.find((item) => item.word === word)) {
    displayAlert("Duplicated", "warning", "Item already in table");
    return;
  }

  try {
    const response = await xhrRequest(
      "GET",
      `${config.BASE_API_URL_DICTIONARY}/${word}`
    );
    addItemInTable(response[0]);
    addToCache(response[0]);
    updateStorage();
  } catch (error) {
    if (error.title && error.message) {
      displayAlert(
        error.title,
        "error",
        `${error.message}. ${error.resolution}`
      );
      return;
    }
    displayAlert(error.name, "error", error.message);
  }
}

function clear() {
  if (config.cache.length === 0) {
    displayAlert("Nothing to delete", "question");
    return;
  }

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      displayAlert("Deleted", "success", `${config.cache.length} word deleted`);
      config.cache = [];
      searchDisplay.innerHTML = "";
      updateStorage();
    }
  });
}

function addItemInTable(response) {
  searchDisplay.innerHTML += `
    <tr>
      <td data-index>#</td>
      <td>${response.word}</td>
      <td>${response.phonetic || response.phonetics[1]?.text || "..."}</td>
      <td>${response.meanings[0].partOfSpeech}</td>
      <td>${response.meanings[0].definitions[0].definition}</td>
      <td>${response.meanings[0].synonyms.join(", ") || "..."}</td>
      <td>${response.meanings[0].antonyms.join(", ") || "..."}</td>
      <td>
        <a href="${response.sourceUrls[0]}" target="_blank">
        ${response.sourceUrls[0]}
        </a>
      </td>
      <td class="actions">
        <span class="action" onclick="playSound('${
          response.phonetics[0].audio
        }')"><i class="bi bi-play-fill"></i></span>
        <span class="action" onclick="removeItemFromTable(this)"><i class="bi bi-trash-fill"></i></span>
      </td>
    </tr>
  `;
  adjustTableIndexes();
}

function updateStorage() {
  localStorage.setItem(
    config.KEY_STORAGE_DICTIONARY,
    JSON.stringify(config.cache)
  );
}

function addToCache(response) {
  config.cache.push({
    response,
    word: response.word,
  });
}

function loadCache() {
  const cache = localStorage.getItem(config.KEY_STORAGE_DICTIONARY);
  if (cache) {
    config.cache = JSON.parse(cache);
    if (config.cache.length >= 1) {
      config.cache.forEach((element) => {
        addItemInTable(element.response);
      });
    }
  }
}

function removeFromCache(word) {
  const index = config.cache.findIndex((item) => item.word === word);
  config.cache.splice(index, 1);
}

function adjustTableIndexes() {
  document.querySelectorAll("td[data-index]").forEach((element, index) => {
    element.textContent = index + 1;
  });
}

function removeItemFromTable(object) {
  const tr = object.parentNode.parentNode;
  const word = tr.children[1].textContent;
  tr.remove();
  removeFromCache(word);
  adjustTableIndexes();
  updateStorage();
  displayAlert("Word deleted", "success", "Table indexes adjusted");
}

function playSound(source) {
  if (!source) {
    displayAlert(
      "Missing sound",
      "info",
      "This word doesn't have sound uploaded"
    );
    textToSpeech("Audio not found", true);
    return;
  }
  audio.src = source;
  audio.play();
}

function textToSpeech(text = "Audio not found", play = true) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.voice = speechSynthesis.getVoices()[0];
  if (play) {
    speechSynthesis.speak(speech);
  }
  return new Blob([speech.audio], { type: "audio/wav" });
}

function xhrRequest(method, url, body = {}) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  if (method !== "GET") {
    xhr.setRequestHeader("Content-Type", "application/json");
  }
  xhr.send(JSON.stringify(body));
  return new Promise((resolve, reject) => {
    xhr.onerror = () => {
      reject(JSON.parse(xhr.responseText));
    };

    xhr.onload = () => {
      if (xhr.status >= 400) {
        reject(JSON.parse(xhr.responseText));
      }
      resolve(JSON.parse(xhr.responseText));
    };
  });
}

function displayAlert(title, icon, text = "") {
  Swal.fire({ title, icon, text });
}

const wordList = [
  "actress",
  "actual",
  "actually",
  "ad",
  "adapt",
  "add",
  "addition",
  "additional",
  "address",
  "adequate",
  "adjust",
  "adjustment",
  "administration",
  "administrator",
  "admire",
  "admission",
  "admit",
  "adolescent",
  "adopt",
  "adult",
  "advance",
  "advanced",
  "advantage",
  "adventure",
  "advertising",
  "advice",
  "advise",
  "adviser",
  "advocate",
  "affair",
  "affect",
  "afford",
  "afraid",
  "African",
  "African-American",
  "after",
  "afternoon",
  "again",
  "against",
  "age",
  "agency",
  "agenda",
  "agent",
  "aggressive",
  "ago",
  "agree",
  "agreement",
  "agricultural",
  "ah",
  "ahead",
  "aid",
  "aide",
  "AIDS",
  "aim",
  "air",
  "aircraft",
  "airline",
  "airport",
  "album",
  "alcohol",
  "alive",
  "all",
  "alliance",
  "allow",
  "ally",
  "almost",
  "alone",
  "along",
  "already",
  "also",
  "alter",
  "alternative",
  "although",
  "always",
  "AM",
  "amazing",
  "American",
  "among",
  "amount",
  "analysis",
  "analyst",
  "analyze",
  "ancient",
  "and",
  "anger",
  "angle",
];

// wordList.forEach((word) => {
//   search(word);
// });
