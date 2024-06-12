// import { useContext } from 'react'
// import { MainContext } from '../context/MainContext'
import CRUDInterface from '../interfaces/crud-interface'
import DataPaths from '../config/data-paths'
import { FirebaseCreateOptions } from '../config/firebase-types'
import * as DataType from '../config/data-types'

/***************  Remove upon implementation - to be used for testing  ***************/

// Test data objects to save to DB ...
const me = { ...new DataType.User('Dad', 'Thomas', 65) }
const fullMe = { ...new DataType.ExpandedUser(me, 'Dude! Software, man!', 'MobileSteading') }
const location = { ...new DataType.City('Lake Shastina', 'NorCal') }
const testDataObject = me

// Testable options and required params ...
const data = testDataObject
const basePath = DataPaths.globalBasePath
const pathExtension = DataPaths.globalExtensionPath
const autoGenId = false
const merge = false
const options = new FirebaseCreateOptions(data, basePath, pathExtension, autoGenId, merge)

/*************** END Remove on implementation - to be used for testing ***************/

export default function RecordCreate() {
    // const {
    //     mainState: {
    //     }
    // } = useContext(MainContext)

    // Primary 'create' operation, passed through Interface layer ...
    const saveRecord = () => {
        CRUDInterface.createRecord(options)
    }

    return (
        <div className='create-container modal-basic-style'>
            <h2>Data and Options objects viewable below<br />as assigned in the RecordCreate component.</h2>
            <div className='output-display'>
                <label>Your 'testDataObject':</label><br />
                <textarea readOnly defaultValue={JSON.stringify(testDataObject, null, 2)}></textarea>
            </div>
            <div className='output-display'>
                <label>Your Options object:</label><br />
                <textarea readOnly defaultValue={JSON.stringify(options, null, 2)}></textarea>
            </div>
            <br />
            <h3>Full page refresh needed to update Data and Options display</h3>
            <button type='button' onClick={saveRecord}>Save To Database</button>
        </div>
    )
}
