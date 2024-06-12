import { useContext } from 'react'
import { MainContext } from '../context/MainContext'
import CRUDInterface from '../interfaces/crud-interface'
import DataPaths from '../config/data-paths'
import { FirebaseReadOptions } from '../config/firebase-types'

/***************  Remove upon implementation - to be used for testing  ***************/

// Testable options and required params ...
const basePath = DataPaths.globalBasePath
const pathExtension = DataPaths.globalExtensionPath
const isCollection = false
const options = new FirebaseReadOptions(basePath, isCollection, pathExtension)

/*************** END Remove on implementation - to be used for testing ***************/

export default function RecordRead() {
    const {
        mainState: {
            readDisplay
        }
    } = useContext(MainContext)

    // Primary 'read' operation, passed through Interface layer ...
    const readRecord = () => {
        CRUDInterface.readRecord(options)
    }

    return (
        <div className='create-container modal-basic-style'>
            <h2>Requested record viewable below<br />as assigned in the RecordRead component.</h2>
            <div className='output-display'>
                <label>Your record:</label><br />
                <textarea readOnly value={JSON.stringify(readDisplay, null, 2)}></textarea>
            </div>
            <br />
            <button type='button' onClick={readRecord}>Read From Database</button>
        </div>
    )
}
