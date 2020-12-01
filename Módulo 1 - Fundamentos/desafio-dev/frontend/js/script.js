/**
 * Objeto de estado global da aplicação
 */
const globalState = {
  allDevs: [],
  filteredDevs: [],
  loadingData: true,
  currentFilter: '',

  radioAnd: false,
  radioOr: true,

  checkboxes: [
    {
      filter: 'java',
      description: 'Java',
      checked: true,
    },
    {
      filter: 'javascript',
      description: 'JavaScript',
      checked: true,
    },
    {
      filter: 'python',
      description: 'Python',
      checked: true,
    },
  ],
};

/**
 * Variáveis globais que mapeiam elementos HTML
 */
const globalDivDevs = document.querySelector('#divDevs');
const globalInputName = document.querySelector('#inputName');
const globalDivCheckboxes = document.querySelector('#checkboxes');
const globalRadioAnd = document.querySelector('#radioAnd');
const globalRadioOr = document.querySelector('#radioOr');

/**
 * Aplicação começa aqui
 */
async function start() {
  /**
   * Adicionado eventos aos inputs, checkboxes e radio buttons
   */
  globalInputName.addEventListener('input', handleInputChange);
  globalRadioAnd.addEventListener('input', handleRadioClick);
  globalRadioOr.addEventListener('input', handleRadioClick);

  /**
   * Renderizando os checkboxes de forma dinâmica
   */
  renderCheckboxes();

  /**
   * Obtendo todos os devs do backend de forma assíncrona
   */
  await fetchAll();

  /**
   * Iniciamos o app já filtrando os devs conforme
   * valor inicial dos inputs
   */
  filterDevs();
}

/**
 * Atribuindo o valor do input ao globalState
 */
function handleInputChange({ target }) {
  globalState.currentFilter = target.value.toLocaleLowerCase().trim();

  filterDevs();
}

/**
 * Lidando com os cliques nos checkboxes
 */
function handleRadioClick({ target }) {
  const radioId = target.id;

  globalState.radioAnd = radioId === 'radioAnd';
  globalState.radioOr = radioId === 'radioOr';

  filterDevs();
}

/**
 * Função para montar os checkboxes
 */
function renderCheckboxes() {
  const { checkboxes } = globalState;

  const inputCheckboxes = checkboxes.map((checkbox) => {
    const { filter: id, description, checked } = checkbox;

    return `
      <label class="option">
        <input
          id="${id}"
          type="checkbox"
          checked="${checked}"
        />
        <span>${description}</span>
      </label>
    `;
  });

  globalDivCheckboxes.innerHTML = inputCheckboxes.join('');

  checkboxes.forEach((checkbox) => {
    const { filter: id } = checkbox;
    const element = document.querySelector(`#${id}`);
    element.addEventListener('input', handleCheckboxClick);
  });
}

function handleCheckboxClick({ target }) {
  const { id, checked } = target;
  const { checkboxes } = globalState;

  const checkboxToChange = checkboxes.find(
    (checkbox) => checkbox.filter === id
  );
  checkboxToChange.checked = checked;

  filterDevs();
}

async function fetchAll() {
  const url = 'http://localhost:3001/devs';

  const resource = await fetch(url);
  const json = await resource.json();

  const jsonWithImprovedSearch = json.map((item) => {
    const { name, programmingLanguages } = item;

    const lowerCaseName = name.toLocaleLowerCase();

    return {
      ...item,
      searchName: removeAccentMarksFrom(lowerCaseName)
        .split('')
        .filter((char) => char !== ' ')
        .join(''),
      searchLanguages: getOnlyLanguagesFrom(programmingLanguages),
    };
  });

  globalState.allDevs = [...jsonWithImprovedSearch];
  globalState.filteredDevs = [...jsonWithImprovedSearch];

  globalState.loadingData = false;
}

/**
 * Função para remover acentos e caracteres especiais de texto
 */
function removeAccentMarksFrom(text) {
  const WITH_ACCENT_MARKS = 'áãâäàéèêëíìîïóôõöòúùûüñ'.split('');
  const WITHOUT_ACCENT_MARKS = 'aaaaaeeeeiiiiooooouuuun'.split('');

  const newText = text
    .toLocaleLowerCase()
    .split('')
    .map((char) => {
      const index = WITH_ACCENT_MARKS.indexOf(char);

      if (index > -1) {
        return WITHOUT_ACCENT_MARKS[index];
      }

      return char;
    })
    .join('');

  return newText;
}

/**
 * Função para varrer o array de languages
 * e trazer somente o nome em minúsculas, de forma ordenada
 */
function getOnlyLanguagesFrom(languages) {
  return languages.map((item) => item.language.toLocaleLowerCase()).sort();
}

/**
 * Principal função deste app.
 * Filtra os devs conforme definições, do usuário e invoca a renderização da tela
 */
function filterDevs() {
  const { allDevs, radioOr, currentFilter, checkboxes } = globalState;

  const filterDevs = checkboxes
    .filter(({ checked }) => checked)
    .map(({ filter }) => filter)
    .sort();

  let filteredDevs = allDevs.filter(({ searchLanguages }) => {
    return radioOr
      ? filterDevs.some((item) => searchLanguages.includes(item))
      : filterDevs.join('') === searchLanguages.join('');
  });

  if (currentFilter) {
    filteredDevs = filteredDevs.filter(({ searchName }) =>
      searchName.includes(currentFilter)
    );
  }

  globalState.filteredDevs = filteredDevs;

  renderDevs();
}

function renderDevs() {
  const { filteredDevs } = globalState;

  const devsToShow = filteredDevs
    .map((devs) => {
      return renderDev(devs);
    })
    .join('');

  const renderedHTML = `
      <div>
        <h2>${filteredDevs.length} dev(s) encontrado(s)</h2>
          <div class="row">
            ${devsToShow}
          </div>
      </div>
    `;

  globalDivDevs.innerHTML = renderedHTML;
}

function renderDev(dev) {
  const { name, picture, programmingLanguages, searchLanguages } = dev;

  return `
    <div class="col s12 m6 l4">
      <div class='devs-card'>
        <img class='picture' src="${picture}" alt="${name}" />
        <div class="data">
          <span>${name}</span>
          <span>${renderProgrammingLanguages(programmingLanguages)}</span>
        </div>
      </div>
    </div>    
  `;
}

/**
 * Função para renderizar as linguagens de programação.
 */
function renderProgrammingLanguages(programmingLanguages) {
  const lang = programmingLanguages.map((lang) => lang.language);

  const img = lang
    .map((item) => {
      return `<img src="img/${item}.png" />`;
    })
    .join('');

  return img;
}

/**
 * Executando o app
 */
start();
