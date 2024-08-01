// components/TaskItem.jsx
import React from 'react';

const TaskItem = ({ categoryName, task, taskIndex, handleDeleteTask }) => (
  <li
    className={`flex justify-between items-center p-2 border rounded mb-2 ${
      task.importance === "high" ? "bg-red-200" : "bg-yellow-200"
    }`}
  >
    <button
      onClick={() => handleDeleteTask(categoryName, taskIndex)}
      className="bg-red-500 text-white p-1 rounded"
    >
      X
    </button>
    {task.name} - {task.points} points
    <button className="bg-green-500 text-white p-1 rounded">✔</button>
  </li>
);

export default TaskItem;
