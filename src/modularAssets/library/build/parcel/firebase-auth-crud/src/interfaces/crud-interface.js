import FirebaseCreateService from '../services/firebase/firebase-create.service'
import FirebaseReadService from '../services/firebase/firebase-read.service'
import FirebaseUpdateService from '../services/firebase/firebase-update.service'
import FirebaseDeleteService from '../services/firebase/firebase-delete.service'

class CRUDInterface {
    createRecord(options) {
        FirebaseCreateService.createRecord(options)
    }

    readRecord(options) {
        FirebaseReadService.readRecord(options)
    }

    updateRecord(options) {
        FirebaseUpdateService.updateRecord(options)
    }

    deleteRecord(options) {
        FirebaseDeleteService.deleteRecord(options)
    }
}

export default new CRUDInterface()
