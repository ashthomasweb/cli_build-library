import FirebaseInitialization from './firebase-init.service'
import {
    collection,
    doc,
    getDocs,
    getDoc
} from 'firebase/firestore'

class FirebaseReadService {
    mainDispatch = null
    app = FirebaseInitialization.app
    db = FirebaseInitialization.db

    setLocalDispatch(dispatch) {
        this.mainDispatch = dispatch
    }

    // Retrieve either a collection or individual document as defined in options, and set to Context ...
    async readRecord(options) {
        const results = []
        try {
            if (options.isCollection) {
                const collectionRef = collection(this.db, options.path)
                const collectionsSnapshot = await getDocs(collectionRef)
                if (collectionsSnapshot.exists()) {
                    collectionsSnapshot.forEach(doc => ( results.push(doc.data()) ))
                    console.log(`Record successfully retrieved from Firestore with options: `, options)
                } else {
                    throw new Error(`No such collection found!`)
                }
            } else {
                const docRef = doc(this.db, options.basePath, options.pathExtension)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    results.push(docSnap.data())
                    console.log(`Record successfully retrieved from Firestore with options: `, options)
                } else {
                    throw new Error(`No such document found!`)
                }
            }
        } catch (error) {
            console.log(`An error occurred during 'Read' operations with options: `, options)
            console.error(error)
        }
        this.setReadRecords(results)
    }

    setReadRecords(results) {
        const payload = {
            readDisplay: results
        }
        this.mainDispatch({ payload })
    }
}

export default new FirebaseReadService()
