import { initializeApp, getApps } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDF2gMs96NQOqLZwO9pHCPDIpBK2hIMtrY",
  authDomain: "tshirt-shop-7a12e.firebaseapp.com",
  projectId: "tshirt-shop-7a12e",
  storageBucket: "tshirt-shop-7a12e.firebasestorage.app",
  messagingSenderId: "954202316202",
  appId: "1:954202316202:web:a8b2acf0cb5efa1cdd9fd3"
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)
export default app