// components/TaskEditForm.jsx
import React from "react";

const TaskEditForm = ({ editingTask, handleChange, handleSaveEdit }) => (
  <>
    <input
      name="name"
      value={editingTask.name}
      onChange={handleChange}
      className="text-center font-medium"
    />
    <input
      name="points"
      value={editingTask.points}
      onChange={handleChange}
      className="text-center"
    />
    <input
      name="dueDate"
      type="date"
      value={editingTask.dueDate}
      onChange={handleChange}
      className="text-center"
    />
    <button
      onClick={handleSaveEdit}
      className="mt-2 p-1 bg-blue-500 text-white rounded w-1/2"
    >
      Save
    </button>
  </>
);

export default TaskEditForm;
