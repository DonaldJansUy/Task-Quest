// components/CategoryItem.jsx
import React from 'react';
import TaskItem from './TaskItem';

const CategoryItem = ({ provided, category, expandedCategories, toggleCategoryExpansion, handleDeleteTask }) => (
  <div
    ref={provided.innerRef}
    {...provided.draggableProps}
    {...provided.dragHandleProps}
    className="ml-8 mb-4"
  >
    <h3 className="font-bold cursor-pointer" onClick={() => toggleCategoryExpansion(category.name)}>
      # {category.name}
    </h3>
    {expandedCategories[category.name] && (
      <ul>
        {category.tasks.map((task, taskIndex) => (
          <TaskItem
            key={taskIndex}
            categoryName={category.name}
            task={task}
            taskIndex={taskIndex}
            handleDeleteTask={handleDeleteTask}
          />
        ))}
      </ul>
    )}
  </div>
);

export default CategoryItem;
