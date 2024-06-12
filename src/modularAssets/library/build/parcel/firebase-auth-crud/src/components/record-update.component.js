// import { useContext } from 'react'
// import { MainContext } from '../context/MainContext'
import CRUDInterface from '../interfaces/crud-interface'
import { FirebaseUpdateOptions } from '../config/firebase-types'
import DataPaths from '../config/data-paths'

/***************  Remove upon implementation - to be used for testing  ***************/

// Testable options and required params ...
const basePath = DataPaths.globalBasePath
const pathExtension = DataPaths.globalExtensionPath
const newData = {
    'types.acoustic.upright': 'Would be nice!'
}
const options = new FirebaseUpdateOptions(basePath, pathExtension, newData)

/*************** END Remove on implementation - to be used for testing ***************/

export default function RecordUpdate() {
    // const {
    //     mainState: {
    //     }
    // } = useContext(MainContext)

    // Primary 'update' operation, passed through Interface layer ...
    const updateRecord = () => {
        CRUDInterface.updateRecord(options)
    }

    return (
        <div className='create-container modal-basic-style'>
            <h2>Updated record viewable in 'Read' pane<br />as assigned in the RecordUpdate component.</h2>
            <br />
            <button type='button' onClick={updateRecord}>Update Record</button>
        </div>
    )
}