import { db } from "./config"
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore"
import { Order } from "@/types"

const COLLECTION = "orders"

export const createOrder = async (order: Omit<Order, "id">): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTION), order)
  return docRef.id
}

export const getOrderById = async (id: string): Promise<Order | null> => {
  const snapshot = await getDoc(doc(db, COLLECTION, id))
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() } as Order
}

export const getOrdersByUser = async (userId: string): Promise<Order[]> => {
  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order))
}

export const getAllOrders = async (): Promise<Order[]> => {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order))
}

export const updateOrderStatus = async (
  id: string,
  status: Order["status"]
): Promise<void> => {
  await updateDoc(doc(db, COLLECTION, id), { status })
}