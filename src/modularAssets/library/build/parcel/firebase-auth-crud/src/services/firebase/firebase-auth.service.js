import FirebaseInitialization from "./firebase-init.service"
import {
    getAuth,
    signOut,
    signInWithRedirect,
    GoogleAuthProvider,
    getRedirectResult
} from "firebase/auth"
import { User } from "../../config/data-types"
import { FirebaseCreateOptions } from "../../config/firebase-types"
import CRUDInterface from "../../interfaces/crud-interface"
import DataPaths from "../../config/data-paths"

class FirebaseAuthService {
    mainDispatch = null
    auth = null
    app = FirebaseInitialization.app

    constructor() {
        this.auth = getAuth()
        this.handleRedirectResult()
    }

    setLocalDispatch(dispatch) {
        this.mainDispatch = dispatch
    }

    firebaseSignIn() {
        const provider = new GoogleAuthProvider()
        signInWithRedirect(this.auth, provider)
    }

    handleRedirectResult() {
        getRedirectResult(this.auth)
            .then((result) => {
                if (result) {
                    // This gives you a Google Access Token. You can use it to access the Google API
                    const credential = GoogleAuthProvider.credentialFromResult(result)
                    const token = credential.accessToken
                    // The signed-in user info
                    const user = result.user
                    // IdP data available using getAdditionalUserInfo(result)
                    // Set user info to Context
                    this.setUserObjToState(user)
                    this.setUserToFirestore(user)
                }
            }).catch((error) => {
                // Handle Errors here
                const errorCode = error.code
                const errorMessage = error.message
                // The email of the user's account used
                const email = error.customData.email
                // The AuthCredential type that was used
                const credential = GoogleAuthProvider.credentialFromError(error)
                alert(errorMessage, errorCode)
            })
    }

    firebaseSignOut() {
        if (this.auth === null) {
            alert('No user currently authorized')
            return
        }
        signOut(this.auth).then(() => {
            // Sign-out successful
            this.setNullUserToState()
        }).catch((error) => {
            // An error happened
            console.error(error)
            alert(`An error occured during SignOut`)
        })
    }

    // Set user information to Firestore DB ...
    setUserToFirestore(user) {
        const userName = user.displayName
        const userEmail = user.email
        const newUser = { ...new User(userName, userEmail) }
        const options = new FirebaseCreateOptions(newUser, DataPaths.base.users, user.uid, false, true)
        CRUDInterface.createRecord(options)
    }

    // Set user object and name to state for further usage and display ...
    setUserObjToState(userObj) {
        const payload = {
            userObj,
            userName: userObj.displayName
        }
        this.mainDispatch({ payload })
    }

    // Reset user object and name fields in state to default conditions ...
    setNullUserToState() {
        const payload = {
            userObj: null,
            userName: 'User'
        }
        this.mainDispatch({ payload })
    }
}

export default new FirebaseAuthService()