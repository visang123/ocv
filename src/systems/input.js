export function createInputState() {
  return {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false,
    a: false,
    d: false,
    w: false,
    s: false
  };
}

export function resetKeys(inputState) {
  Object.keys(inputState).forEach(function (key) {
    inputState[key] = false;
  });
}

export function getControlKey(event) {
  const codeControls = {
    ArrowLeft: "ArrowLeft",
    ArrowRight: "ArrowRight",
    ArrowUp: "ArrowUp",
    ArrowDown: "ArrowDown",
    KeyA: "a",
    KeyD: "d",
    KeyW: "w",
    KeyS: "s",
    KeyE: "e",
    KeyQ: "q",
    Space: " "
  };

  if (event.code in codeControls) {
    return codeControls[event.code];
  }

  return event.key.length === 1 ? event.key.toLowerCase() : event.key;
}
