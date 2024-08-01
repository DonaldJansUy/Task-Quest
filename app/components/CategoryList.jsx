// components/CategoryList.jsx
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import CategoryItem from './CategoryItem';

const CategoryList = ({ categoryList, expandedCategories, toggleCategoryExpansion, handleDeleteTask, onDragEnd }) => (
  <div className="mb-4 overflow-y-auto max-h-96">
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="categories">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {categoryList.map((category, index) => (
              <Draggable key={category.name} draggableId={category.name} index={index}>
                {(provided) => (
                  <CategoryItem
                    provided={provided}
                    category={category}
                    expandedCategories={expandedCategories}
                    toggleCategoryExpansion={toggleCategoryExpansion}
                    handleDeleteTask={handleDeleteTask}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  </div>
);

export default CategoryList;
