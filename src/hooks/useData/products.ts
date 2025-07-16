import { db } from "@/firebase";
import { Product } from "@/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

export function useProduct() {
  const createProductFirebase = async (productInfo: Product) => {
    await addDoc(collection(db, "products"), {
      name: productInfo.name,
      category: productInfo.category,
      status: productInfo.status,
      price: productInfo.price,
      stock: productInfo.stock,
      createdAt: productInfo.createdAt,
    });
  };

  const updateProductFirebase = async (
    productInfo: Product,
    newProductInfo: Product
  ) => {
    if (!productInfo.id) return;

    const docref = doc(db, "products", productInfo.id);

    await updateDoc(docref, {
      name: newProductInfo.name ?? productInfo.name,
      price: newProductInfo.price ?? productInfo.price,
      category: newProductInfo.category ?? productInfo.category,
      stock: newProductInfo.stock ?? productInfo.stock,
      status: newProductInfo.status ?? productInfo.status,
      createdAt: newProductInfo.createdAt ?? productInfo.createdAt,
    });
  };

  const getProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as unknown as Product[];

    return products;
  };

  const deleteProductFirebase = async (productId: string) => {
    await deleteDoc(doc(db, "products", productId));
  };

  return {
    createProductFirebase,
    updateProductFirebase,
    getProducts,
    deleteProductFirebase,
  };
}
