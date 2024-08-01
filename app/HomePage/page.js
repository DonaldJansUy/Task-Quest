"use client"

import React, { useState } from "react";
import Link from "next/link";
import Modal from "react-modal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Header from "../components/Header";
import Quote from "../components/Quote";
import TaskControls from "../components/TaskControls";
import CategoryControls from "../components/CategoryControls";
import CategoryList from "../components/CategoryList";
import TaskModal from "../components/TaskModal";

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

  const handleAddTask = () => {
    if (task && selectedCategory) {
      const updatedCategories = categoryList.map((category) => {
        if (category.name === selectedCategory) {
          return {
            ...category,
            tasks: [
              ...category.tasks,
              { name: task, points: parseInt(points), importance },
            ],
          };
        }
        return category;
      });
      setCategoryList(updatedCategories);
      setTotalPoints(totalPoints + parseInt(points));
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

  const handleDeleteTask = (categoryName, taskIndex) => {
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
    <div className="p-4">
      <Header />
      <main>
        <Quote />
        <TaskControls openModal={openModal} />
        <h2 className="font-bold text-center">AVAILABLE TQ POINTS: {totalPoints}</h2>
        <CategoryControls hideAllCategories={hideAllCategories} expandAllCategories={expandAllCategories} />
        <CategoryList
          categoryList={categoryList}
          expandedCategories={expandedCategories}
          toggleCategoryExpansion={toggleCategoryExpansion}
          handleDeleteTask={handleDeleteTask}
          onDragEnd={onDragEnd}
        />
      </main>
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
  );
};

export default HomePage;