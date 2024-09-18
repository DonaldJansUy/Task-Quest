// components/CategoryItem.jsx
import React, { useState } from "react";
import { useUserAuth } from '../components/_utils/auth-context';
import {
  completeTaskInFirestore,
  deleteTaskFromFirestore,
  updateTaskInFirestoreByName,
} from "./_services/task-list";
import { format, differenceInDays } from 'date-fns';
import TaskEditForm from "./TaskEditForm"; // Import TaskEditForm

const CategoryItem = ({
  category,
  expandedCategories,
  toggleCategoryExpansion,
  handleDeleteTask,
  handleCompleteTask,
  handleUpdateTask,
}) => {
  const { user } = useUserAuth();
  const [editingTask, setEditingTask] = useState(null);

  const handleCompleteAndUpdatePoints = async (categoryName, taskIndex, task) => {
    if (user && task && task.name) {
      try {
        await completeTaskInFirestore(user.uid, task.name, task.points);
        handleCompleteTask(categoryName, taskIndex);
      } catch (error) {
        console.error("Error completing task: ", error);
        alert(`Error completing task: ${error.message}`);
      }
    }
  };

  const handleDelete = async (categoryName, taskIndex, taskId) => {
    if (user && confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTaskFromFirestore(user.uid, taskId);
        handleDeleteTask(categoryName, taskIndex);
      } catch (error) {
        console.error("Error deleting task: ", error);
        alert(`Error deleting task: ${error.message}`);
      }
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleSaveEdit = async () => {
    if (user && editingTask) {
      try {
        await updateTaskInFirestoreByName(user.uid, editingTask.name, editingTask);
        handleUpdateTask(editingTask.category, editingTask.name, editingTask);
        setEditingTask(null); // Reset editing state
      } catch (error) {
        console.error("Error updating task:", error);
        alert(`Error updating task: ${error.message}`);
      }
    }
  };

  const handleChange = (e) => {
    setEditingTask({
      ...editingTask,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="mb-4 p-4 bg-white rounded shadow">
      <h3
        className="font-bold text-lg cursor-pointer"
        onClick={() => toggleCategoryExpansion(category.name)}
      >
        {category.name}
      </h3>
      {expandedCategories[category.name] && (
        <div className="flex flex-wrap justify-center mt-4 gap-20">
          {category.tasks.map((task, taskIndex) => {
            const dueDate = task.dueDate ? new Date(task.dueDate) : null;
            const daysLeft = dueDate ? differenceInDays(dueDate, new Date()) : null;
            return (
              <div
                key={taskIndex}
                className="w-full sm:w-1/4 border border-gray-300 p-2 rounded bg-gray-50"
              >
                {editingTask && editingTask.id === task.id ? (
                  <TaskEditForm
                    editingTask={editingTask}
                    handleChange={handleChange}
                    handleSaveEdit={handleSaveEdit}
                  />
                ) : (
                  <>
                    <p className="text-center font-medium">{task.name}</p>
                    <p className="text-center text-xs ">
                      Due Date: {dueDate ? `${format(dueDate, 'yyyy-MM-dd')} (${daysLeft} days left)` : "No due date"}
                    </p>
                    <p className="text-center">Points: {task.points}</p>
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleCompleteAndUpdatePoints(category.name, taskIndex, task)}
                        className="mt-2 p-1 bg-green-500 text-white rounded w-1/2"
                      >
                        Completed
                      </button>
                      <button
                        onClick={() => handleEditTask(task)}
                        className="mt-2 p-1 bg-yellow-500 text-white rounded w-1/2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.name, taskIndex, task.name)}
                        className="mt-2 p-1 bg-red-500 text-white rounded w-1/2"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryItem;
