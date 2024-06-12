import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import dotenv from 'dotenv'
dotenv.config()

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
}

class FirebaseInitialization {
    constructor() {
        try {
            this.app = initializeApp(firebaseConfig)
            this.db = getFirestore(this.app)
        } catch (error) {
            console.error(error)
            console.log(`Error initializing Firebase app!`)
        }
    }
}

export default new FirebaseInitialization()
