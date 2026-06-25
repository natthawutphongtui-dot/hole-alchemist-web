import { auth, db } from "./config"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { User } from "@/types"

const googleProvider = new GoogleAuthProvider()

export const registerWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<void> => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password)
  await createUserDocument(user, displayName)
}

export const loginWithEmail = async (email: string, password: string): Promise<void> => {
  await signInWithEmailAndPassword(auth, email, password)
}

export const loginWithGoogle = async (): Promise<void> => {
  const { user } = await signInWithPopup(auth, googleProvider)
  await createUserDocument(user, user.displayName ?? "")
}

export const logout = async (): Promise<void> => {
  await signOut(auth)
  document.cookie = "firebase-token=; path=/; max-age=0"
}

export const getCurrentUser = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const token = await user.getIdToken()
      document.cookie = `firebase-token=${token}; path=/; max-age=3600; SameSite=Strict`
    } else {
      document.cookie = "firebase-token=; path=/; max-age=0"
    }
    callback(user)
  })
}

export const getUserDocument = async (userId: string): Promise<User | null> => {
  const snapshot = await getDoc(doc(db, "users", userId))
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() } as User
}

const createUserDocument = async (user: FirebaseUser, displayName: string): Promise<void> => {
  const userRef = doc(db, "users", user.uid)
  const snapshot = await getDoc(userRef)
  if (!snapshot.exists()) {
    await setDoc(userRef, {
      email: user.email,
      displayName,
      photoURL: user.photoURL ?? "",
      role: "customer",
      createdAt: new Date(),
    })
  }
}