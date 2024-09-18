import React from "react";
import CategoryItem from "./CategoryItem";

const CategoryList = ({
  categoryList,
  expandedCategories,
  toggleCategoryExpansion,
  handleDeleteTask,
  handleCompleteTask,
  handleUpdateTask,
}) => {
  return (
    <div className="space-y-4">
      {categoryList.map((category, index) => (
        <CategoryItem
          key={index}
          category={category}
          expandedCategories={expandedCategories}
          toggleCategoryExpansion={toggleCategoryExpansion}
          handleDeleteTask={handleDeleteTask}
          handleCompleteTask={handleCompleteTask}
          handleUpdateTask={handleUpdateTask}
        />
      ))}
    </div>
  );
};

export default CategoryList;
