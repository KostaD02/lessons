const displayResult = document.querySelector("#displayResult");
const actionButtons = document.querySelectorAll(".action");

const config = {
  MIN: 0,
  MAX: 25,
  VALUE_ATTR_NAME: "data-value",
  value: 0,
};

actionButtons.forEach((button) => {
  checkDisableButtons(actionButtons);
  button.addEventListener("click", () => {
    const value = getValue(button);
    if (value === config.MIN || value === config.MAX) {
      config.value = value;
      displayResult.innerHTML = value;
    } else if (value <= 0) {
      decrementValue(Math.abs(value));
    } else {
      incrementValue(value);
    }
    checkDisableButtons(actionButtons);
  });
});

function incrementValue(count = 1) {
  if (config.MAX < config.value + count) {
    return;
  }
  displayResult.innerHTML = config.value + count;
  config.value += count;
}

function decrementValue(count = 1) {
  if (config.MIN > config.value - count) {
    return;
  }
  displayResult.innerHTML = config.value - count;
  config.value -= count;
}

function checkDisableButtons(buttons = []) {
  buttons.forEach((button) => {
    const value = getValue(button);
    const minOrMax = value > 0 ? config.MAX : config.MIN;
    if (
      value === 1 ||
      value === -1 ||
      value === config.MAX ||
      value === config.MIN
    ) {
      button.disabled = minOrMax === config.value;
    } else {
      if (minOrMax === config.MIN) {
        button.disabled = minOrMax > config.value + Number(value);
      } else {
        button.disabled = minOrMax < config.value + Number(value);
      }
    }
  });
}

function getValue(button) {
  let value = Number(button.getAttribute(config.VALUE_ATTR_NAME));
  if (!isFinite(value)) {
    value = value === Infinity ? config.MAX : config.MIN;
  }
  return value;
}
