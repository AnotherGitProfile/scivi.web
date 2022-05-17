import DFDEditor from './DFDEditor';
import './App.css'
import { DFDEditorDb } from './DFDEditorDb';
import { BaseDFDNode } from './BaseDFDNode';
import { DbContext } from './DbContext';
import { workerFromCode } from './utils/helperFunctions';

function fillDb(db) {
  const maxComponent = new BaseDFDNode({
    name: 'Max',
    db,
    inputs: [
      {
        type: 'num',
        name: 'Value1',
      },
      {
        type: 'num',
        name: 'Value2',
      }
    ],
    outputs: [
      {
        type: 'num',
        name: 'Max',
      }
    ],
    workerFunc: workerFromCode(`
      OUTPUT['Max'] = Math.max(INPUT['Value1'], INPUT['Value2']);
    `),
  });
  const numComponent = new BaseDFDNode({
    name: 'Number',
    db,
    settings: [
      {
        type: 'num',
        name: 'Value',
      }
    ],
    outputs: [
      {
        type: 'num',
        name: 'Value',
      }
    ],
    workerFunc: (node, inputs, outputs) => {
      outputs['Value'] = node.data.num;
    }
  });
  const display = new BaseDFDNode({
    name: 'Display',
    db,
    inputs: [
      {
        type: 'num',
        name: 'Value',
      }
    ],
    workerFunc: workerFromCode(`
      if (IN_VISUALIZATION) {
        const text = document.createElement('textarea');
        text.innerHTML = INPUT['Value'];
        text.width = '100px';
        text.height = '100px';
        ADD_VISUAL(text);
      }
    `),
  });
  db.addComponent(maxComponent);
  db.addComponent(numComponent);
  db.addComponent(display);
}

function App() {
  const db = new DFDEditorDb();
  fillDb(db);

  return (
    <DbContext.Provider value={db}>
      <DFDEditor/>
    </DbContext.Provider>
  )
}

export default App
