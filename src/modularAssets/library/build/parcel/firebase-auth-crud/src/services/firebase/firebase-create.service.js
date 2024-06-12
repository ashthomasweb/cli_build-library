import FirebaseInitialization from './firebase-init.service'
import {
    addDoc,
    collection,
    doc,
    setDoc
} from 'firebase/firestore'

class FirebaseCreateService {
    mainDispatch = null
    app = FirebaseInitialization.app
    db = FirebaseInitialization.db

    setLocalDispatch(dispatch) {
        this.mainDispatch = dispatch
    }

    // Create a new document, or pass a new field to existing document, as defined in options ...
    async createRecord(options) {
        try {
            if (options.autoGenId) {
                const docRef = await addDoc(collection(this.db, options.basePath), options.data)
                console.log(`Document with options set with new data at ${options.basePath}/${docRef.id}`, options)
            } else {
                await setDoc(doc(this.db, options.basePath, options.pathExtension), options.data, { merge: options.merge }) // ATTN: Does this need to be included with an 'Update' function present??
                console.log(`Document with options set at ${options.basePath}/${options.pathExtension}`, options)
            }
        } catch (error) {
            console.error("Error adding document: ", error)
        }
    }
}

export default new FirebaseCreateService()
