import { db } from '../_utils/firebase';
import { collection, getDocs, addDoc, query, deleteDoc, doc, updateDoc, where, increment } from "firebase/firestore";

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

export const addTaskToFirestore = async (userId, categoryName, task) => {
  try {
    const tasksRef = collection(db, `users/${userId}/items`);
    const newTask = {
      ...task,
      category: categoryName,
      creator: userId,
    };
    const docRef = await addDoc(tasksRef, newTask);
    
    return docRef.id;
  } catch (error) {
    console.error("Error adding task to Firestore:", error);
    throw error;
  }
};

export const completeTaskInFirestore = async (userId, taskName, taskPoints) => {
  if (!userId || !taskName || taskPoints === undefined) {
    throw new Error("Missing required parameters for completeTaskInFirestore");
  }

  const tasksRef = collection(db, `users/${userId}/items`);
  const q = query(tasksRef, where("name", "==", taskName));
  const querySnapshot = await getDocs(q);

  // Log the number of documents found for debugging
  console.log(`User ID: ${userId}, Task Name: ${taskName}, Query Results: ${querySnapshot.docs.length} found`);

  if (querySnapshot.empty) {

    return "Task not found";
  }

  const taskDoc = querySnapshot.docs[0];
  if (!taskDoc || !taskDoc.ref) {
    throw new Error("Task document reference not found");
  }

  await deleteDoc(taskDoc.ref);

  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    accumulatedPoints: increment(taskPoints)
  });

  return "Task completed successfully"; // Return a success message
};

export const deleteTaskFromFirestore = async (userId, taskId) => {
  try {
    const taskRef = doc(db, `users/${userId}/items`, taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error("Error deleting task from Firestore: ", error);
    throw error;
  }
};