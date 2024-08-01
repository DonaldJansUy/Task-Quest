import { db } from "../_utils/firebase";
import { collection, getDocs, addDoc, query, deleteDoc, doc } from "firebase/firestore";

// Function to get all tasks from the database
export const getTasks = async (userId) => {
    try {
        const tasks = [];
        const q = query(collection(db, `users/${userId}/tasks`));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            tasks.push({ id: doc.id, ...doc.data() });
        });
        return tasks;
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
};

// Function to add a new task to the database
export const addTask = async (userId, task) => {
    try {
        const docRef = await addDoc(collection(db, `users/${userId}/tasks`), task);
        return docRef.id;
    } catch (error) {
        console.error("Error adding document: ", error);
    }
};

// Function to delete an existing task in the database
export const deleteTask = async (userId, taskId) => {
    try {
        const docRef = doc(db, `users/${userId}/tasks/${taskId}`);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting document: ", error);
    }
};
