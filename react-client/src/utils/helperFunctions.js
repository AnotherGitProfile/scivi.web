/**
 * @param {string} path
 */
export async function downloadJSOperator(path) {
  const response = await fetch(path);
  const scriptText = await response.text();
  return scriptText;
}

/**
 * @param {string} code
 * @returns {Function}
 */
export function createJSOperatorFn(code) {
  const operatorFn = Function(
    "INPUT",
    "OUTPUT",
    "SETTINGS",
    "SETTINGS_VAL",
    "SETTINGS_CHANGED",
    "PROPERTY",
    "HAS_INPUT",
    "UPDATE_WIDGETS",
    "DATA",
    "CACHE",
    "PROCESS",
    "IN_VISUALIZATION",
    "ADD_VISUAL",
    code
  );
  return operatorFn;
}

/**
 * @param {Function} operatorFn
 * @param {Object} context
 */
export function executeJSOperator(operatorFn, context) {
  const {
    input,
    output,
    settings,
    settingsVal,
    settingsChanged,
    property,
    hasInput,
    updateWidgets,
    data,
    cache,
    process,
    inVisualization,
    addVisual,
  } = context;
  operatorFn.call(
    undefined,
    input,
    output,
    settings,
    settingsVal,
    settingsChanged,
    property,
    hasInput,
    updateWidgets,
    data,
    cache,
    process,
    inVisualization,
    addVisual
  );
}

/**
 * @param {string} path
 */
export async function downloadAndExecuteJSOperator(path, context) {
  const code = await downloadJSOperator(path);
  const operatorFn = createJSOperatorFn(code);
  executeJSOperator(operatorFn, context);
}

export function workerFromCode(code) {
  const fn = createJSOperatorFn(code);
  return (node, input, output) => {
    executeJSOperator(fn, {
      input,
      output,
      inVisualization: true,
    });
  };
}
