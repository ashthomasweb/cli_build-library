// import { useContext } from 'react'
// import { MainContext } from '../context/MainContext'
import CRUDInterface from '../interfaces/crud-interface'
import DataPaths from '../config/data-paths'
import { FirebaseDeleteOptions } from '../config/firebase-types'

/***************  Remove upon implementation - to be used for testing  ***************/

// Testable options and required params ...
const basePath = DataPaths.globalBasePath
const pathExtension = DataPaths.globalExtensionPath
const markForDelete = true
const deleteField = false
const documentDelete = false
const fieldToDelete = 'types.digital.unweighted'
const options = new FirebaseDeleteOptions(basePath, pathExtension, markForDelete, deleteField, documentDelete, fieldToDelete)

/*************** END Remove on implementation - to be used for testing ***************/

export default function RecordDelete() {
    // const {
    //     mainState: {
    //     }
    // } = useContext(MainContext)
   
    // Primary 'delete' operation, passed through Interface layer ...
    const deleteRecord = () => {
        CRUDInterface.deleteRecord(options)
    }

    return (
        <div className='create-container modal-basic-style'>
            <h2>Deleted record no longer viewable due to full 'delete', or updated and viewable in 'Read' pane<br />as assigned in the RecordDelete component.</h2>
            <br />
            <button type='button' onClick={deleteRecord}>Delete Record</button>
        </div>
    )
}