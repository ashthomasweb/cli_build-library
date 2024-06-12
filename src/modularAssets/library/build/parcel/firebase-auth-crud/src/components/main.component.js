import { useContext } from 'react'
import { MainContext } from '../context/MainContext'
import UserAuth from './user-auth.component'
import RecordCreate from './record-create.component'
import RecordRead from './record-read.component'
import RecordUpdate from './record-update.component'
import RecordDelete from './record-delete.component'

export default function Main() {
    const {
        mainState: {
            userName,
            userObj
        }
    } = useContext(MainContext)

    return (
        <div>
            <h1>Hello {userName}, this is your Parcel app! You currently <strong>{userObj === null ? 'ARE NOT' : 'ARE'}</strong> logged in.</h1>
            <h2>Below you will find a series of standard functions, de-coupled and issued through an Interface Layer.</h2>
            <h2>Take note! Display values are not always handled to auto-update. Further development is required to persist values on-screen. Make sure to perform a hard-refresh, empty cache - and/or delete your parcel-cache if in doubt!</h2>
            <hr />
            <UserAuth />
            <br /><hr /><br />
            <RecordCreate />
            <br /><hr /><br />
            <RecordRead />
            <br /><hr /><br />
            <RecordUpdate />
            <br /><hr /><br />
            <RecordDelete />
            <br /><hr /><br />
        </div>
    )
}