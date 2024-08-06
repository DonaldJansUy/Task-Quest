"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Quote from "../components/Quote";
import TaskControls from "../components/TaskControls";
import CategoryControls from "../components/CategoryControls";
import CategoryList from "../components/CategoryList";
import TaskModal from "../components/TaskModal";
import { useUserAuth } from "../components/_utils/auth-context";
import { addTaskToFirestore, getTasksFromFirestore, deleteTaskFromFirestore, completeTaskInFirestore } from "../components/_services/task-list";
import { doc, updateDoc, increment } from "firebase/firestore"; // Import Firestore functions


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
  const [tasks, setTasks] = useState([]); // Added state for tasks

  const { user } = useUserAuth(); // Access the authenticated user

  // Fetch tasks from Firestore when component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      if (user) {
        const fetchedTasks = await getTasksFromFirestore(user.uid);
        setTasks(fetchedTasks);

        // Update categories with fetched tasks
        const updatedCategories = initialCategories.map(category => ({
          ...category,
          tasks: fetchedTasks.filter(task => task.category === category.name),
        }));
        setCategoryList(updatedCategories);

        // Calculate total points
        const totalPoints = fetchedTasks.reduce((sum, task) => sum + task.points, 0);
        setTotalPoints(totalPoints);
      }
    };

    fetchTasks();
  }, [user]);

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

  const handleAddTask = async () => {
    if (task && selectedCategory && user) {
      const newTask = {
        name: task,
        points: parseInt(points),
        importance: importance === "high",
        creator: user.uid // Add the creator field
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

      // Add task to Firestore
      await addTaskToFirestore(user.uid, selectedCategory, newTask);

      closeModal();
    }
  };

  const handleAddCategory = () => {
    if (newCategory && !categoryList.some((category) => category.name === newCategory)) {
      setCategoryList([...categoryList, { name: newCategory, tasks: [] }]);
      setNewCategory("");
      setIsAddingCategory(false);
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
  
    // Delete task from Firestore
    const taskToDelete = categoryList.find(category => category.name === categoryName).tasks[taskIndex];
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
  
    // Complete task in Firestore
    const completedTask = categoryList.find(category => category.name === categoryName).tasks[taskIndex];
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
          handleCompleteTask={handleCompleteTask} // Pass handleCompleteTask to CategoryList
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
          handleAddTask={handleAddTask}
          categoryList={categoryList}
          handleAddCategory={handleAddCategory}
        />
      </div>
    </main>
  );
};

export default HomePage;
