const todos = [];
const RENDER_EVENT = 'render-todo';
const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';
let Finalscore = 0,
  FnafasScore = 0,
  FnadiScore = 0,
  TDSscore = 0,
  SuhuScore = 0;
  Kategori = null;

function generateId() {
  return +new Date();
}

function generateTime() {
  const timestamp = +new Date();
  const date = new Date(timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  let formattedTime = hours + ":" + minutes + ":" + seconds;
  return formattedTime;
}

function generateTodoObject(id, Fnafas, Fnadi, CRT, TDS, Tsadar, Suhu, Finalscore, Kategori, timestamps, isCompleted) {
  return {
    id,
    Fnafas,
    Fnadi,
    CRT,
    TDS,
    Tsadar,
    Suhu,
    Finalscore,
    Kategori,
    timestamps,
    isCompleted
  };
}

function findTodo(todoId) {
  for (const todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}

function findTodoIndex(todoId) {
  for (const index in todos) {
    if (todos[index].id === todoId) {
      return index;
    }
  }
  return -1;
}


/**
 * Fungsi ini digunakan untuk memeriksa apakah localStorage didukung oleh browser atau tidak
 *
 * @returns boolean
 */
function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

/**
 * Fungsi ini digunakan untuk menyimpan data ke localStorage
 * berdasarkan KEY yang sudah ditetapkan sebelumnya.
 */
function saveData() {
  if (isStorageExist()) {
    const parsed /* string */ = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

/**
 * Fungsi ini digunakan untuk memuat data dari localStorage
 * Dan memasukkan data hasil parsing ke variabel {@see todos}
 */
function loadDataFromStorage() {
  const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const todo of data) {
      todos.push(todo);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeTodo(todoObject) {
  const { id, Fnafas, Fnadi, CRT, TDS, Tsadar, Suhu, Finalscore, Kategori, timestamps, isCompleted } = todoObject;

  const textScore = document.createElement('h2');
  textScore.innerText = "Score " + Finalscore;

  // const textFnafas = document.createElement('p');
  // textFnafas.innerText = "Frekuensi pernafasan " + Fnafas + "(Score " + FnafasScore + ")";

  // const textFnadi = document.createElement('p');
  // textFnadi.innerText = "Frekuensi Nadi " + Fnadi + "(Score " + FnadiScore + ")";

  // const textCRT = document.createElement('p');
  // textCRT.innerText = "Kategori CRT " + CRT + "(Score " + CRT + ")";

  // const textTDS = document.createElement('p');
  // textTDS.innerText = "Tekanan Darah Sistolik " + TDS + "(Score " + TDSscore + ")";

  // const textTsadar = document.createElement('p');
  // textTsadar.innerText = "Tingkat Kesadaran " + Tsadar + "(Score " + Tsadar + ")";

  // const textSuhu = document.createElement('p');
  // textSuhu.innerText = "Suhu " + Suhu + "(Score " + SuhuScore + ")";
  
  const textKategori = document.createElement('h2');
  textKategori.innerText = Kategori;

  if (Kategori == "Stabil") {
    textKategori.setAttribute('id', 'stabil');
    textKategori.setAttribute('class','kategoriStabil')
  }
  if (Kategori == "Resiko Ringan") {
    textKategori.setAttribute('id', 'ringan');
    textKategori.setAttribute('class','kategoriRingan')
  }
  if (Kategori == "Resiko Sedang") {
    textKategori.setAttribute('id', 'sedang');
    textKategori.setAttribute('class','kategoriSedang')
  }
  if (Kategori == "Resiko Tinggi") {
    textKategori.setAttribute('id', 'tinggi');
    textKategori.setAttribute('class','kategoriTinggi')
  }

  const textTimestamps = document.createElement('p');
  textTimestamps.innerText = timestamps;

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  // textContainer.append(textScore, textFnafas, textFnadi, textCRT, textTDS, textTsadar, textSuhu, textKategori, textTimestamps);
  textContainer.append(textScore, textKategori, textTimestamps);
  const container = document.createElement('div');
  container.classList.add('item', 'shadow')
  container.append(textContainer);
  container.setAttribute('id', `todo-${id}`);

  if (isCompleted) {

    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
    undoButton.addEventListener('click', function () {
      undoTaskFromCompleted(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(id);
    });

    container.append(undoButton, trashButton);
  } else {

    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    checkButton.addEventListener('click', function () {
      addTaskToCompleted(id);
    });

    container.append(checkButton);
  }

  return container;
}

function Fnafas_Score() {
  if (Fnafas < 8) {
    FnafasScore = 2;
  }
  else if (Fnafas == 8) {
    FnafasScore = 1;
  }
  else if (Fnafas >= 8 && Fnafas <= 17) {
    FnafasScore = 0;
  }
  else if (Fnafas >= 18 && Fnafas <= 20) {
    FnafasScore = 1;
  }
  else if (Fnafas >= 21 && Fnafas <= 29) {
    FnafasScore = 2;
  }
  else if (Fnafas >= 30) {
    FnafasScore = 3;
    }
  return FnafasScore;
}


function addTodo() {
  const Fnafas = document.getElementById('Fnafas').value;
  const Fnadi = document.getElementById('Fnadi').value;
  const CRT = document.getElementById('CRT').value;
  const TDS = document.getElementById('TDS').value;
  const Tsadar = document.getElementById('Tsadar').value;
  const Suhu = document.getElementById('Suhu').value;
 
  //Fnafas
  if (Fnafas < 8) {
    FnafasScore = 2;
  }
  else if (Fnafas == 8) {
    FnafasScore = 1;
  }
  else if (Fnafas >= 8 && Fnafas <= 17) {
    FnafasScore = 0;
  }
  else if (Fnafas >= 18 && Fnafas <= 20) {
    FnafasScore = 1;
  }
  else if (Fnafas >= 21 && Fnafas <= 29) {
    FnafasScore = 2;
  }
  else if (Fnafas >= 30) {
    FnafasScore = 3;
  }

  //FNadi
  if (Fnadi < 40) {
    FnadiScore = 2;
  }
  else if (Fnadi >= 40 && Fnadi <= 50) {
    FnadiScore = 1;
  }
  else if (Fnadi >= 51 && Fnadi <= 100) {
    FnadiScore = 0;
  }
  else if (Fnadi >= 101 && Fnadi <= 110) {
    FnadiScore = 1;
  }
  else if (Fnadi >= 111 && Fnadi <= 129) {
    FnadiScore = 2;
  }
  else if (Fnadi >= 130) {
    FnadiScore = 3;
  }

  //TDS
  if (TDS <= 70) {
    TDSscore = 3;
  }
  else if (TDS >=71 && TDS <=80) {
    TDSscore = 2;
  }
  else if (TDS >=81 && TDS <=100) {
    TDSscore = 1;
  }
  else if (TDS >=101 && TDS <=159) {
    TDSscore = 0;
  }
  else if (TDS >=160 && TDS <=199) {
    TDSscore = 1;
  }
  else if (TDS >=200 && TDS <=220) {
    TDSscore = 2;
  }
  else if (TDS >220) {
    TDSscore = 3;
  }

//Suhu
  if (Suhu < 35) {
    SuhuScore = 2;
  }
  else if (Suhu >= 35.05 && Suhu <= 36) {
    SuhuScore = 1;
  }
  else if (Suhu >= 36.05 && Suhu <= 38) {
    SuhuScore = 0;
  }
  else if (Suhu >= 38.05 && Suhu <= 38.5) {
    SuhuScore = 1;
  }
  else if (Suhu > 38.5) {
    SuhuScore = 2;
  }

  Finalscore = parseInt(FnafasScore) + parseInt(FnadiScore) + parseInt(CRT) + parseInt(TDSscore) + parseInt(Tsadar) + parseInt(SuhuScore) ;

  if (Finalscore == 0 || Finalscore == 1) {
    Kategori = "Stabil";
  }
  else if (Finalscore == 2 || Finalscore == 3) {
    Kategori = "Resiko Ringan";
  }
  else if (Finalscore == 4 || Finalscore == 5) {
    Kategori = "Resiko Sedang";
  }
  else if (Finalscore >= 6) {
    Kategori = "Resiko Tinggi";
  }

  const timestamps = generateTime();

  const generatedID = generateId();
  const todoObject = generateTodoObject(generatedID, Fnafas, Fnadi, CRT, TDS, Tsadar, Suhu, Finalscore, Kategori, timestamps, false);
  todos.push(todoObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addTaskToCompleted(todoId /* HTMLELement */) {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromCompleted(todoId /* HTMLELement */) {
  const todoTarget = findTodoIndex(todoId);

  if (todoTarget === -1) return;

  todos.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(todoId /* HTMLELement */) {

  const todoTarget = findTodo(todoId);
  if (todoTarget == null) return;

  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener('DOMContentLoaded', function () {

  const submitForm /* HTMLFormElement */ = document.getElementById('form');

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addTodo();
    form.reset();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data berhasil di simpan.');
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedTODOList = document.getElementById('todos');
  const listCompleted = document.getElementById('completed-todos');

  // clearing list item
  uncompletedTODOList.innerHTML = '';
  listCompleted.innerHTML = '';

  for (const todoItem of todos) {
    const todoElement = makeTodo(todoItem);
    if (todoItem.isCompleted) {
      listCompleted.append(todoElement);
    } else {
      uncompletedTODOList.append(todoElement);
    }
  }
});
