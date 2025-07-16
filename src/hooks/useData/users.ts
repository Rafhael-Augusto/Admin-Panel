import { db } from "@/firebase";
import { User } from "@/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

export function useUser() {
  const createUserFirebase = async (userInfo: User) => {
    await addDoc(collection(db, "users"), {
      name: userInfo.name,
      email: userInfo.email,
      role: userInfo.role,
      status: userInfo.status,
      createdAt: userInfo.createdAt,
    });
  };

  const updateUsersFirebase = async (userInfo: User, newUserInfo: User) => {
    if (!userInfo.id) return;

    const docref = doc(db, "users", userInfo.id);

    await updateDoc(docref, {
      name: newUserInfo.name ?? userInfo.name,
      email: newUserInfo.email ?? userInfo.email,
      role: newUserInfo.role ?? userInfo.role,
      status: newUserInfo.status ?? userInfo.status,
      createdAt: newUserInfo.createdAt ?? userInfo.createdAt,
    });
  };

  const getUsers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as unknown as User[];

    return users;
  };

  const deleteUserFirebase = async (userId: string) => {
    await deleteDoc(doc(db, "users", userId));
  };

  return {
    createUserFirebase,
    updateUsersFirebase,
    getUsers,
    deleteUserFirebase,
  };
}
