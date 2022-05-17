import { useContext, useRef, useState } from 'react';
import Rete from 'rete';
import ConnectionPlugin from 'rete-connection-plugin';
import ReactRenderPlugin from 'rete-react-render-plugin';
import DockLayout from 'rc-dock';
import 'rc-dock/dist/rc-dock.css';
import { useRete } from './useRete';
import { DbContext } from './DbContext';

const createEditor = ({ components, onNodeSelected, onNodeRemoved }) => async (container) => {
  const editor = new Rete.NodeEditor('SciViEditor@0.1.0', container);
  editor.use(ConnectionPlugin);
  editor.use(ReactRenderPlugin);

  components.forEach((component) => {
    editor.register(component);
  });
  editor.on('nodeselect', (node) => onNodeSelected(node));
  editor.on('noderemove', (node) => onNodeRemoved(node));

  return editor;
};

const treeTab = (components, onNewNodeClick) => {
  return {
    id: 'tree',
    title: 'Tree',
    content: (
      <div>
        <ul>
          {components.map(component => <li key={component.name} onClick={() => onNewNodeClick(component.name)}>{component.name}</li>)}
        </ul>
      </div>
    )
  }
};

const editorContainerTab = (setContainer, onVisualizeClick) => {
  return {
    id: 'tab1',
    title: 'DFD',
    cached: true,
    content: (
      <div>
        <button onClick={() => onVisualizeClick()}>Visualize</button>
        <div
          style={{
            width: "100vw",
            height: "100vh"
          }}
          ref={(ref) => ref && setContainer(ref)}
        />
      </div>
    )
  };
};

const nodeSettingsTab = (selectedNode, editor) => {
  function handleDeleteClick() {
    editor.removeNode(selectedNode);
  }

  return {
    id: 'settingsTab',
    title: 'Settings',
    content: (Boolean(selectedNode) && (
      <div>
        <button onClick={handleDeleteClick}>Delete</button>
      </div>
    )),
  }
};


function DFDEditor() {
  const db = useContext(DbContext);
  const dockLayout = useRef();
  const components = db.getAllComponents();
  const [inVisualization, setInVisualization] = useState(false);
  const [visualizeTabs, setVisualizeTabs] = useState([]);
  const [setContainer, editor] = useRete(createEditor({
    components: components,
    onNodeSelected: handleNodeSelected,
    onNodeRemoved: handleNodeRemoved,
  }));

  function handleNodeSelected(node) {
    dockLayout.current.updateTab('settingsTab', nodeSettingsTab(node, editor.current));
  }

  function handleNodeRemoved(node) {
    dockLayout.current.updateTab('settingsTab', nodeSettingsTab(null, editor.current));
  }

  function handleVisualizeClicked() {
    setInVisualization(true);
    //editor.current.process();
    /*
    setVisualizeTabs([
      {
        id: 'float',
        title: 'New Window',
        content: (
          <div>
            <p>Right click on the max button ⇗</p>
          </div>
        ),
      }
    ]);
    */
    const floatPanel = dockLayout.current.find('float');
    dockLayout.current.dockMove({
      id: 'scene1',
      title: 'Scene1',
      content: 'Foo',
    }, floatPanel, 'float');
  }

  async function handleNewNodeClicked(componentName) {
    const newNodeComponent = editor.current.getComponent(componentName);
    const newNode = await newNodeComponent.createNode({
      inVisualization
    });
    newNode.position = [80, 200];
    editor.current.addNode(newNode);
  }

  const layout = {
    floatbox: {
      mode: 'float',
      children: [
        {
          tabs: visualizeTabs,
          x: 60,
          y: 60,
          w: 420,
          h: 400
        }
      ],
    },
    dockbox: {
      mode: 'horizontal',
      children: [
        {
          size: 200,
          children: [
            {
              tabs: [
                treeTab(components, handleNewNodeClicked),
              ]
            }
          ]
        },
        {
          mode: 'vertical',
          size: 1000,
          children: [
            {
              id: 'centralPanel',
              size: 600,
              tabs: [
                editorContainerTab(setContainer, handleVisualizeClicked),
              ],
            },
            {
              size: 200,
              tabs: [
                nodeSettingsTab(null, editor.current),
              ]
            }
          ]
        }
      ]
    }
  };

  return (
    <DockLayout
      defaultLayout={layout}
      style={{position: 'absolute', left: 10, top: 10, right: 10, bottom: 10 }}
      ref={dockLayout}
    />
  );
}

export default DFDEditor
