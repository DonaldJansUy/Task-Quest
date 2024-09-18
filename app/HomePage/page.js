"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Quote from "../components/Quote";
import TaskControls from "../components/TaskControls";
import CategoryControls from "../components/CategoryControls";
import CategoryList from "../components/CategoryList";
import TaskModal from "../components/TaskModal";
import { useUserAuth } from "../components/_utils/auth-context";
import {
  addTaskToFirestore,
  getTasksFromFirestore,
  deleteTaskFromFirestore,
  completeTaskInFirestore,
  updateTaskInFirestoreByName,
  addCategoryToFirestore,   // New function to handle adding categories
} from "../components/_services/task-list";

const initialCategories = [
  { name: "Friends", tasks: [] },
  { name: "Work", tasks: [] },
  { name: "Fitness", tasks: [] },
  { name: "Food", tasks: [] },
];

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [task, setTask] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [categoryList, setCategoryList] = useState(initialCategories);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [points, setPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [importance, setImportance] = useState("low");
  const [tasks, setTasks] = useState([]);
  const [dueDate, setDueDate] = useState("");

  const { user } = useUserAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      if (user) {
        const fetchedTasks = await getTasksFromFirestore(user.uid);
        setTasks(fetchedTasks);

        const updatedCategories = initialCategories.map((category) => ({
          ...category,
          tasks: fetchedTasks.filter((task) => task.category === category.name),
        }));
        setCategoryList(updatedCategories);

        const totalPoints = fetchedTasks.reduce((sum, task) => sum + task.points, 0);
        setTotalPoints(totalPoints);
      }
    };

    fetchTasks();
  }, [user]);

  const handleUpdateTask = async (categoryName, taskName, updatedTask) => {
    const updatedCategories = categoryList.map((category) => {
      if (category.name === categoryName) {
        const updatedTasks = category.tasks.map((task) => 
          task.name === taskName ? { ...task, ...updatedTask } : task
        );
        return { ...category, tasks: updatedTasks };
      }
      return category;
    });

    setCategoryList(updatedCategories);

    if (user && updatedTask.name) {
      try {
        await updateTaskInFirestoreByName(user.uid, updatedTask.name, updatedTask);
        console.log("Task updated successfully!");
      } catch (error) {
        console.error("Error updating task: ", error);
        alert(`Error updating task: ${error.message}`);
      }
    }
  };

  const handleAddTask = async () => {
    if (task && selectedCategory && user && dueDate) {
      const newTask = {
        name: task,
        points: parseInt(points),
        importance: importance === "high",
        dueDate,
        creator: user.uid,
        category: selectedCategory, // Include the category name
      };

      const updatedCategories = categoryList.map((category) => {
        if (category.name === selectedCategory) {
          return {
            ...category,
            tasks: [...category.tasks, newTask],
          };
        }
        return category;
      });

      setCategoryList(updatedCategories);
      setTotalPoints(totalPoints + parseInt(points));

      await addTaskToFirestore(user.uid, selectedCategory, newTask, dueDate);

      closeModal();
    }
  };

  const handleDeleteTask = async (categoryName, taskIndex) => {
    const updatedCategories = categoryList.map((category) => {
      if (category.name === categoryName) {
        const taskToDelete = category.tasks[taskIndex];
        const updatedTasks = category.tasks.filter((_, index) => index !== taskIndex);
        setTotalPoints(totalPoints - taskToDelete.points);
        return { ...category, tasks: updatedTasks };
      }
      return category;
    });
    setCategoryList(updatedCategories);

    const taskToDelete = categoryList.find((category) => category.name === categoryName).tasks[taskIndex];
    await deleteTaskFromFirestore(user.uid, taskToDelete.name);
  };

  const handleCompleteTask = async (categoryName, taskIndex) => {
    const updatedCategories = categoryList.map((category) => {
      if (category.name === categoryName) {
        const completedTask = category.tasks[taskIndex];
        const updatedTasks = category.tasks.filter((_, index) => index !== taskIndex);
        setTotalPoints(totalPoints - completedTask.points);
        return { ...category, tasks: updatedTasks };
      }
      return category;
    });
    setCategoryList(updatedCategories);

    const completedTask = categoryList.find((category) => category.name === categoryName).tasks[taskIndex];
    await completeTaskInFirestore(user.uid, completedTask.name, completedTask.points);
  };

  const toggleCategoryExpansion = (categoryName) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const hideAllCategories = () => {
    const allCollapsed = categoryList.reduce((acc, category) => {
      acc[category.name] = false;
      return acc;
    }, {});
    setExpandedCategories(allCollapsed);
  };

  const expandAllCategories = () => {
    const allExpanded = categoryList.reduce((acc, category) => {
      acc[category.name] = true;
      return acc;
    }, {});
    setExpandedCategories(allExpanded);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const updatedCategories = Array.from(categoryList);
    const [movedCategory] = updatedCategories.splice(result.source.index, 1);
    updatedCategories.splice(result.destination.index, 0, movedCategory);
    setCategoryList(updatedCategories);
  };

  const handleAddCategory = async (categoryName) => {
    if (categoryName && !categoryList.some((category) => category.name === categoryName)) {
      const newCategory = {
        name: categoryName,
        tasks: [],
      };
      setCategoryList([...categoryList, newCategory]);

      if (user) {
        try {
          await addCategoryToFirestore(user.uid, categoryName);  // Save new category to Firestore
        } catch (error) {
          console.error("Error adding category: ", error);
          alert(`Error adding category: ${error.message}`);
        }
      }
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setTask("");
    setSelectedCategory("");
    setNewCategory("");
    setPoints(0);
    setIsAddingCategory(false);
    setIsModalOpen(false);
    setImportance("low");
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-green-500 to-red-500">
      <div className="bg-white bg-opacity-80 rounded-lg p-10 w-full max-w-full m-9">
        <Header />
        <Quote />
        <TaskControls openModal={openModal} />
        <h2 className="font-bold text-center text-2xl mt-4 mb-8">
          AVAILABLE TQ POINTS: {totalPoints}
        </h2>
        <CategoryControls
          hideAllCategories={hideAllCategories}
          expandAllCategories={expandAllCategories}
        />
        <CategoryList
          categoryList={categoryList}
          expandedCategories={expandedCategories}
          toggleCategoryExpansion={toggleCategoryExpansion}
          handleDeleteTask={handleDeleteTask}
          handleCompleteTask={handleCompleteTask}
          handleUpdateTask={handleUpdateTask} // Pass handleUpdateTask to CategoryList
          onDragEnd={onDragEnd}
        />
        <TaskModal
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          task={task}
          setTask={setTask}
          points={points}
          setPoints={setPoints}
          importance={importance}
          setImportance={setImportance}
          dueDate={dueDate}
          setDueDate={setDueDate}
          handleAddTask={handleAddTask}
          categoryList={categoryList}
          handleAddCategory={handleAddCategory} // Pass handleAddCategory to TaskModal
        />
      </div>
    </main>
  );
};

export default HomePage;
