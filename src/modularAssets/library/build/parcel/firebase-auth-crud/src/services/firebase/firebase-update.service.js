import FirebaseInitialization from './firebase-init.service'
import {
    doc,
    updateDoc
} from 'firebase/firestore'

class FirebaseUpdateService {
    mainDispatch = null
    app = FirebaseInitialization.app
    db = FirebaseInitialization.db

    setLocalDispatch(dispatch) {
        this.mainDispatch = dispatch
    }

    // Update individual document with new data fields as passed in options ...
    async updateRecord(options) {
        try {
            const docRef = doc(this.db, options.basePath, options.pathExtension)
            await updateDoc(docRef, options.newData)
            console.log(`Record successfully updated from Firestore with options: `, options)
        } catch (error) {
            console.log(`An error occurred during 'Update' operations with options: `, options)
            console.error(error)
        }
    }
}

export default new FirebaseUpdateService()
