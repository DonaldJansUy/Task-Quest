// app/components/CategoryControls.jsx
import React from "react";

const CategoryControls = ({ hideAllCategories, expandAllCategories }) => (
  <div className="flex justify-center space-x-2 mb-4">
    <button onClick={hideAllCategories} className="text-sm bg-gray-200 p-2 rounded">
      Hide All
    </button>
    <button onClick={expandAllCategories} className="text-sm bg-gray-200 p-2 rounded">
      Expand All
    </button>
  </div>
);

export default CategoryControls;
