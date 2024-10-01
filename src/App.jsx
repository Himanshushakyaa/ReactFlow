import React, { useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import "./index.css"; // Tailwind CSS use in this

const initialTasks = [
  { id: "1", position: { x: 100, y: 100 }, data: { label: "Cow" } },
  { id: "2", position: { x: 300, y: 100 }, data: { label: "Sugarcane" } },
  { id: "3", position: { x: 500, y: 100 }, data: { label: "Tree" } },
];

const initialEdges = [];

function App() {
  const [nodes, setNodes] = useState(initialTasks);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ label: "", status: "" });

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const addTask = () => {
    const newId = (nodes.length + 1).toString();
    const newNode = {
      id: newId,
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: { label: `Task ${newId}: New Task` },
    };
    setNodes([...nodes, newNode]);
  };

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
    setEditData({ label: node.data.label, status: node.data.status });
    setIsEditing(true);
  };

  const updateTask = () => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: { label: editData.label, status: editData.status },
          };
        }
        return node;
      })
    );
    setIsEditing(false);
    setSelectedNode(null);
  };
  return (
    <div className="h-screen bg-gray-100">
      <header className="text-center p-6">
        <h1 className="text-3xl font-bold text-blue-500">
          Diagram flow chart use ReactFlow
        </h1>
        <p className="text-gray-600">Visualize and manage task dependencies</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={addTask}
        >
          Add New
        </button>
      </header>

      <div className="h-4/5 w-full bg-white shadow-md rounded-lg">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
          style={{ width: "100%", height: "100%" }}
        >
          <MiniMap />
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>

      {/* Modal for editing tasks */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>
            <div>
              <label className="block mb-2">Label:</label>
              <input
                type="text"
                value={editData.label}
                onChange={(e) =>
                  setEditData({ ...editData, label: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              />
              <div className="flex justify-end mt-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
                  onClick={updateTask}
                >
                  Save
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
