import { db } from '../_utils/firebase';
import { collection, getDocs, addDoc, query, deleteDoc, doc } from "firebase/firestore";

// Function to retrieve all tasks for a specific user from Firestore
export const getTasksFromFirestore = async (userId) => {
  try {
    const tasks = [];
    const tasksRef = collection(db, `users/${userId}/items`);
    const tasksQuery = query(tasksRef);
    const querySnapshot = await getDocs(tasksQuery);
    
    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });

    return tasks;
  } catch (error) {
    console.error("Error getting tasks from Firestore: ", error);
    throw error;
  }
};

// Function to add a new task to a specific user's list of tasks in Firestore
export const addTaskToFirestore = async (userId, categoryName, task) => {
  try {
    const tasksRef = collection(db, `users/${userId}/items`);
    const newTask = {
      ...task,
      category: categoryName,
      creator: userId, // Add the creator field
    };
    const docRef = await addDoc(tasksRef, newTask);
    
    return docRef.id;
  } catch (error) {
    console.error("Error adding task to Firestore:", error);
    throw error;
  }
};

// Function to delete a task from a specific user's list of tasks in Firestore
export const deleteTaskFromFirestore = async (userId, taskId) => {
  try {
    const taskRef = doc(db, `users/${userId}/items`, taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error("Error deleting task from Firestore: ", error);
    throw error;
  }
};
