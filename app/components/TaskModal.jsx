// components/TaskModal.jsx
import React from 'react';
import Modal from 'react-modal';

const TaskModal = ({
  isModalOpen,
  closeModal,
  selectedCategory,
  setSelectedCategory,
  newCategory,
  setNewCategory,
  task,
  setTask,
  points,
  setPoints,
  importance,
  setImportance,
  handleAddTask,
  categoryList,
  handleAddCategory,
}) => (
  <Modal
    isOpen={isModalOpen}
    onRequestClose={closeModal}
    ariaHideApp={false}
    className="modal fixed inset-0 flex items-center justify-center"
    style={{
      content: {
        width: "45%",
        maxWidth: "90%",
        height: "45%",
        maxHeight: "90%",
        margin: "auto",
      },
    }}
  >
    <div className="bg-white p-6 rounded shadow-lg w-full max-w-full mx-auto">
      <h1 className="text-xl font-bold mb-4">New Task</h1>
      <div className="mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded w-full"
        >
          <option value="" disabled>
            Select Category
          </option>
          {categoryList.map((category, index) => (
            <option key={index} value={category.name}>
              {category.name}
            </option>
          ))}
          <option value="add-new">Add New Category</option>
        </select>
        {selectedCategory === "add-new" && (
          <div className="mt-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New Category"
              className="p-2 border rounded w-full"
            />
            <button
              onClick={handleAddCategory}
              className="bg-blue-500 text-white p-2 rounded mt-2"
            >
              Add Category
            </button>
          </div>
        )}
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Task name"
          className="p-2 border rounded w-full"
        />
      </div>

      <div className="mb-4">
        <input
          type="number"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          placeholder="Points"
          className="p-2 border rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label className="mr-4">
          <input
            type="radio"
            value="high"
            checked={importance === "high"}
            onChange={() => setImportance("high")}
            className="mr-2"
          />
          High Importance
        </label>
        <label>
          <input
            type="radio"
            value="low"
            checked={importance === "low"}
            onChange={() => setImportance("low")}
            className="mr-2"
          />
          Low Importance
        </label>
      </div>

      <button onClick={handleAddTask} className="bg-blue-500 text-white p-2 rounded">
        Add Task
      </button>
      <button onClick={closeModal} className="bg-gray-500 text-white p-2 rounded ml-2">
        Close
      </button>
    </div>
  </Modal>
);

export default TaskModal;
