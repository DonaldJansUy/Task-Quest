import { db } from '../_utils/firebase';
import { collection, getDocs, addDoc, query, deleteDoc, doc, updateDoc, where, increment } from "firebase/firestore";

// Function to get all tasks for a user from Firestore
export const getTasksFromFirestore = async (userId) => {
  try {
    const tasks = [];
    const categoriesRef = collection(db, `users/${userId}/categories`);
    const categoriesSnapshot = await getDocs(categoriesRef);

    for (const categoryDoc of categoriesSnapshot.docs) {
      const categoryId = categoryDoc.id;
      const tasksRef = collection(db, `users/${userId}/categories/${categoryId}/items`);
      const tasksSnapshot = await getDocs(tasksRef);

      tasksSnapshot.forEach((taskDoc) => {
        tasks.push({
          id: taskDoc.id,
          categoryId,
          categoryName: categoryDoc.data().name,
          ...taskDoc.data(),
        });
      });
    }

    return tasks;
  } catch (error) {
    console.error("Error getting tasks from Firestore: ", error);
    throw error;
  }
};

// Function to add a new task to Firestore
export const addTaskToFirestore = async (userId, categoryName, task, dueDate) => {
  try {
    if (!dueDate) {
      throw new Error("Due date is required");
    }

    // Find the category by name
    const categoriesRef = collection(db, `users/${userId}/categories`);
    const q = query(categoriesRef, where("name", "==", categoryName));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error(`Category "${categoryName}" not found`);
    }

    const categoryDoc = querySnapshot.docs[0];
    const tasksRef = collection(db, `users/${userId}/categories/${categoryDoc.id}/items`);

    const newTask = {
      ...task,
      category: categoryName,
      creator: userId,
      dueDate,
    };

    const docRef = await addDoc(tasksRef, newTask);
    return docRef.id;
  } catch (error) {
    console.error("Error adding task to Firestore:", error);
    throw error;
  }
};

// Function to mark a task as completed and update the user's accumulated points in Firestore
export const completeTaskInFirestore = async (userId, categoryId, taskId, taskPoints) => {
  if (!userId || !categoryId || !taskId || taskPoints === undefined) {
    throw new Error("Missing required parameters for completeTaskInFirestore");
  }

  const taskRef = doc(db, `users/${userId}/categories/${categoryId}/items/${taskId}`);
  await deleteDoc(taskRef);

  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    accumulatedPoints: increment(taskPoints)
  });

  return "Task completed successfully";
};

// Function to delete a task from Firestore
export const deleteTaskFromFirestore = async (userId, categoryId, taskId) => {
  try {
    const taskRef = doc(db, `users/${userId}/categories/${categoryId}/items`, taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error("Error deleting task from Firestore: ", error);
    throw error;
  }
};

// Function to update an existing task in Firestore
export const updateTaskInFirestoreByName = async (userId, categoryId, taskId, updatedTask) => {
  try {
    const taskRef = doc(db, `users/${userId}/categories/${categoryId}/items`, taskId);
    await updateDoc(taskRef, updatedTask);
  } catch (error) {
    console.error("Error updating task in Firestore:", error);
    throw error;
  }
};
