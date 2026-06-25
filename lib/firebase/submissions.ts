import { db } from "./config"
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore"

export interface Submission {
  id: string
  userId: string
  displayName: string
  designUrl: string
  designUrls?: Record<string, string>
  shirtColor: string
  fabric: string
  note: string
  status: "pending" | "approved" | "rejected"
  createdAt: Date
}

export const createSubmission = async (
  data: Omit<Submission, "id">
): Promise<string> => {
  const docRef = await addDoc(collection(db, "submissions"), data)
  return docRef.id
}

export const getAllSubmissions = async (): Promise<Submission[]> => {
  const q = query(collection(db, "submissions"), orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Submission))
}

export const updateSubmissionStatus = async (
  id: string,
  status: Submission["status"]
): Promise<void> => {
  await updateDoc(doc(db, "submissions", id), { status })
}