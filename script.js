const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let expression = '';

function updateDisplay() {
  display.textContent = expression || '0';
}

function appendNumber(value) {
  if (expression === 'Error') {
    expression = '';
  }

  const lastChar = expression.slice(-1);

  if (value === '.') {
    const currentNumber = expression.split(/[+\-*/]/).at(-1);
    if (currentNumber.includes('.')) return;

    if (!expression || /[+\-*/]/.test(lastChar)) {
      expression += '0.';
    } else {
      expression += '.';
    }
  } else {
    if (expression === '0') {
      expression = value;
    } else {
      expression += value;
    }
  }

  updateDisplay();
}

function appendOperator(operator) {
  if (!expression || expression === 'Error') return;

  const lastChar = expression.slice(-1);

  if (/[+\-*/]/.test(lastChar)) {
    expression = expression.slice(0, -1) + operator;
  } else {
    expression += operator;
  }

  updateDisplay();
}

function clearDisplay() {
  expression = '';
  updateDisplay();
}

function deleteLast() {
  if (!expression || expression === 'Error') {
    expression = '';
  } else {
    expression = expression.slice(0, -1);
  }
  updateDisplay();
}

function calculate() {
  if (!expression || /[+\-*/]$/.test(expression)) return;

  try {
    const result = Function(`"use strict"; return (${expression});`)();

    if (!Number.isFinite(result)) {
      throw new Error('Invalid result');
    }

    expression = Number.isInteger(result)
      ? String(result)
      : String(parseFloat(result.toFixed(10)));
  } catch (error) {
    expression = 'Error';
  }

  updateDisplay();
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const { value, action } = button.dataset;

    if (action === 'clear') {
      clearDisplay();
      return;
    }

    if (action === 'delete') {
      deleteLast();
      return;
    }

    if (action === 'equals') {
      calculate();
      return;
    }

    if (value && /[0-9]/.test(value)) {
      appendNumber(value);
      return;
    }

    if (value === '.') {
      appendNumber('.');
      return;
    }

    if (/[+\-*/]/.test(value)) {
      appendOperator(value);
    }
  });
});

document.addEventListener('keydown', (event) => {
  const { key } = event;

  if (/^[0-9]$/.test(key)) {
    appendNumber(key);
    return;
  }

  if (key === '.') {
    appendNumber('.');
    return;
  }

  if (/[+\-*/]/.test(key)) {
    appendOperator(key);
    return;
  }

  if (key === 'Enter' || key === '=') {
    calculate();
    return;
  }

  if (key === 'Backspace') {
    deleteLast();
    return;
  }

  if (key === 'Escape') {
    clearDisplay();
  }
});

updateDisplay();
