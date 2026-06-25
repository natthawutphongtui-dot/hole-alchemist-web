import { db, storage } from "./config"
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { Product } from "@/types"

const COLLECTION = "products"

export const getProducts = async (): Promise<Product[]> => {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product))
}

export const getProductById = async (id: string): Promise<Product | null> => {
  const snapshot = await getDoc(doc(db, COLLECTION, id))
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() } as Product
}

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const q = query(
    collection(db, COLLECTION),
    where("category", "==", category),
    orderBy("createdAt", "desc")
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product))
}

export const addProduct = async (product: Omit<Product, "id">): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTION), product)
  return docRef.id
}

export const updateProduct = async (id: string, data: Partial<Product>): Promise<void> => {
  await updateDoc(doc(db, COLLECTION, id), data)
}

export const deleteProduct = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTION, id))
}

export const uploadProductImage = async (file: File, productId: string): Promise<string> => {
  const storageRef = ref(storage, `products/${productId}/${file.name}`)
  await uploadBytes(storageRef, file)
  return await getDownloadURL(storageRef)
}