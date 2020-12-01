/**
 * Array de objetos que contém todos os cálculos do app. *
 */
var globalCalculations = [
  {
    id: 1,
    description: 'Soma (a + b):',
    result: function sum(a, b) {
      return a + b;
    },
    type: 'a_b',
  },

  {
    id: 2,
    description: 'Subtração 1 (a - b):',
    result: function subtraction(a, b) {
      return a - b;
    },
    type: 'a_b',
  },

  {
    id: 3,
    description: 'Subtração 2 (b - a):',
    result: function subtraction(b, a) {
      return b - a;
    },
    type: 'b_a',
  },

  {
    id: 4,
    description: 'Multiplicação (a x b):',
    result: function multiplication(a, b) {
      return a * b;
    },
    type: 'a_b',
  },

  {
    id: 5,
    description: 'Divisão 1 (a / b):',
    result: function division(a, b) {
      var value = handleDivision(a, b);
      return formatNumber(value);
    },
    type: 'a_b',
  },

  {
    id: 6,
    description: 'Divisão 2 (b / a):',
    result: function division(b, a) {
      var value = handleDivision(b, a);
      return formatNumber(value);
    },
    type: 'b_a',
  },

  {
    id: 7,
    description: 'Quadrado de a (a²):',
    result: function square(a) {
      return a ** 2;
    },
    type: 'a',
  },

  {
    id: 8,
    description: 'Quadrado de b (b²):',
    result: function square(b) {
      return b ** 2;
    },
    type: 'b',
  },

  {
    id: 9,
    description: 'Divisores inteiros de a:',
    result: function dividers(a) {
      var value = handleDividers(a);
      return value;
    },
    type: 'a',
  },

  {
    id: 10,
    description: 'Divisores inteiros de b:',
    result: function dividers(b) {
      var value = handleDividers(b);
      return value;
    },
    type: 'b',
  },

  {
    id: 11,
    description: 'Fatorial de a (a!):',
    result: function factorial(a) {
      var value = handleFactorial(a);
      return formatNumber(value);
    },
    type: 'a',
  },

  {
    id: 12,
    description: 'Fatorial de b (b!):',
    result: function factorial(b) {
      var value = handleFactorial(b);
      return formatNumber(value);
    },
    type: 'b',
  },
];

/**
 * Método do cálculo da divisão de valores.
 */
function handleDivision(num1, num2) {
  if (num2 == 0) {
    return 'Divisão por 0';
  }

  var value = num1 / num2;
  return value.toFixed(2);
}

/**
 * Método do cálculo de divisores de valores.
 */
function handleDividers(num) {
  var div = [];
  for (var i = 0; i <= num; i++) {
    if (num % i === 0) {
      div.push(i);
    }
  }
  return `${div} (${div.length})`;
}

/**
 * Método do cálculo de fatorial de valores.
 */
function handleFactorial(number) {
  if (number < 0) {
    return 'Número abaixo de 0';
  } else if (number === 0) {
    return 1;
  } else if (number > 0 && number <= 21) {
    var cont = 1;
    for (var i = 1; i <= number; i++) {
      cont *= i;
    }
    return cont;
  } else {
    return 'Número muito grande';
  }
}

/** Método para formatar valores no padrão pt-BR */
function formatNumber(number) {
  return new Intl.NumberFormat('pt-BR').format(number);
}

/**
 * Mapeamento dos input de interação com o usuário.
 */
var globalInputA = document.querySelector('#inputA');
var globalInputB = document.querySelector('#inputB');

/**
 * Função de execução inicial. Ela é chamada no final do arquivo.
 */
function start() {
  globalInputA.addEventListener('input', handleChangeInputA);
  globalInputB.addEventListener('input', handleChangeInputB);

  calculate();
}

/**
 * Função executada após interação com usuário, que dispara o cálculo.
 */
function handleChangeInputA() {
  calculate();
}

/**
 * Função executada após interação com usuário, que dispara o cálculo.
 */
function handleChangeInputB() {
  calculate();
}

/**
 * Principal função do app, que efetua os cálculos e monta a seção "Cálculos" dinamicamente
 */
function calculate() {
  var a = parseInt(globalInputA.value, 10);
  var b = parseInt(globalInputB.value, 10);

  var divCalculations = document.querySelector('#calculations');

  var innerCalculations = document.createElement('div');
  innerCalculations.classList.add('row');

  for (var i = 0; i < globalCalculations.length; i++) {
    var currentCalculation = globalCalculations[i];

    var id = 'input_' + currentCalculation.id;

    var value = getCalculationFrom(
      currentCalculation.type,
      currentCalculation.result,
      a,
      b
    );

    var div = getMaterializeDiv();
    var input = getMaterializeInput(id, value);
    var label = getMaterializeLabel(id, currentCalculation.description);

    div.appendChild(input);
    div.appendChild(label);
    innerCalculations.appendChild(div);
  }

  divCalculations.innerHTML = '';
  divCalculations.appendChild(innerCalculations);
}

/** Obtendo uma nova div */
function getMaterializeDiv() {
  var div = document.createElement('div');
  div.classList.add('input-field', 'col', 's12', 'm6', 'l4');

  return div;
}

/** Obtendo um novo input */
function getMaterializeInput(id, value) {
  var input = document.createElement('input');
  input.readOnly = true;
  input.type = 'text';
  input.id = id;
  input.value = value;

  return input;
}

/** Obtendo uma nova label */
function getMaterializeLabel(id, description) {
  var label = document.createElement('label');
  label.for = id;
  label.textContent = description;
  label.classList.add('active');

  return label;
}

/* Lógica para identificar qual(is) parâmetro(s) será(ão) utilizado(s) e a respectiva ordem */
function getCalculationFrom(type, calculationFunction, a, b) {
  var value = '';

  switch (type) {
    case 'a_b':
      value = calculationFunction(a, b);
      break;

    case 'b_a':
      value = calculationFunction(b, a);
      break;

    case 'a':
      value = calculationFunction(a);
      break;

    case 'b':
      value = calculationFunction(b);
      break;

    default:
      value = 'Cálculo não identificado';
  }

  return value;
}

/**
 * Início da execução do app.
 */
start();
