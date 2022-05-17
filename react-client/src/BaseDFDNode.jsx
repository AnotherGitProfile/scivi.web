import Rete from "rete";

class NumControl extends Rete.Control {
  static component = ({ value, onChange }) => (
    <input
      type="number"
      value={value}
      ref={(ref) => {
        ref && ref.addEventListener("pointerdown", (e) => e.stopPropagation());
      }}
      onChange={(e) => onChange(+e.target.value)}
    />
  );

  constructor(emitter, key, node, readonly = false) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = NumControl.component;

    const initial = node.data[key] || 0;

    node.data[key] = initial;
    this.props = {
      readonly,
      value: initial,
      onChange: (v) => {
        this.setValue(v);
        this.emitter.trigger("process");
      }
    };
  }

  setValue(val) {
    this.props.value = val;
    this.putData(this.key, val);
    this.update();
  }
}

export class BaseDFDNode extends Rete.Component {
  /**
   * @constructor
   * @param {string} options.name
   * @param {DFDEditorDb} options.db
   */
  constructor({ name, db, outputs, inputs, settings, workerFunc }) {
    super(name);
    this.db = db;
    this.outputs = outputs || [];
    this.inputs = inputs || [];
    this.settings = settings || [];
    this.workerFunc = workerFunc;
  }

  /**
   * @param {import('rete').Node} node
   */
  builder(node) {
    for (const output of this.outputs) {
      const newOutput = new Rete.Output(
        output.name,
        output.name,
        this.db.buildOrCreateSocketType(output.type)
      );
      node.addOutput(newOutput);
    }
    for (const input of this.inputs) {
      const newInput = new Rete.Input(
        input.name,
        input.name,
        this.db.buildOrCreateSocketType(input.type)
      );
      node.addInput(newInput);
    }
    // TODO: create control
    if (!node.data.cache) {
      node.data.cache = {};
    }
    if (!node.data.settings) {
      node.data.settings = {};
      node.data.settingsVal = {};
      node.data.settingsType = {};
      node.data.settingsChanged = {};
    }
    const control = new NumControl(this.editor, "num", node);

    node.addControl(control);
    return node;
  }

  worker(node, inputs, outputs) {
    try {
      workerFunc(node, inputs, outputs);
    } catch (err) {
      console.error(err);
    }
  }
}
