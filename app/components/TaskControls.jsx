// components/TaskControls.jsx
import React from 'react';

const TaskControls = ({ openModal }) => (
  <div className="mb-4 flex justify-between">
    <button onClick={openModal} className="bg-blue-500 text-white p-2 rounded">
      New Task
    </button>
  </div>
);

export default TaskControls;
