import React from "react";

const CategoryItem = ({ category, expandedCategories, toggleCategoryExpansion, handleDeleteTask, handleCompleteTask }) => (
  <div className="mb-4 p-4 bg-white rounded shadow">
    <h3 className="font-bold text-lg cursor-pointer" onClick={() => toggleCategoryExpansion(category.name)}>
      {category.name}
    </h3>
    {expandedCategories[category.name] && (
      <div className="flex flex-wrap justify-center mt-4 gap-20">
        {category.tasks.map((task, taskIndex) => (
          <div
            key={taskIndex}
            className="w-full sm:w-1/4 border border-gray-300 p-2 rounded bg-gray-50"
          >
            <p className="text-center font-medium">{task.name}</p>
            <p className="text-center">Points: {task.points}</p>
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => handleCompleteTask(category.name, taskIndex)}
                className="mt-2 p-1 bg-green-500 text-white rounded w-1/2"
              >
                Completed
              </button>
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to delete this task?")) {
                    handleDeleteTask(category.name, taskIndex);
                  }
                }}
                className="mt-2 p-1 bg-red-500 text-white rounded w-1/2"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default CategoryItem;
