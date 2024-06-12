import { createContext } from "react"
import { useReducer } from "react"
import FirebaseAuthService from '../services/firebase/firebase-auth.service'
import FirebaseReadService from "../services/firebase/firebase-read.service"
import FirebaseUpdateService from "../services/firebase/firebase-update.service"
import FirebaseDeleteService from "../services/firebase/firebase-delete.service"

export const MainContext = createContext()

export const initialMainState = {
    userName: 'User',
    userObj: null,
    readDisplay: null,
}

const MainReducer = (state, action) => {
    return {
        ...state,
        ...action.payload
    }
}

const MainProvider = (props) => {
    const [mainState, mainDispatch] = useReducer(MainReducer, initialMainState)

    FirebaseAuthService.setLocalDispatch(mainDispatch)
    FirebaseReadService.setLocalDispatch(mainDispatch)
    FirebaseUpdateService.setLocalDispatch(mainDispatch)
    FirebaseDeleteService.setLocalDispatch(mainDispatch)

    return (
        <MainContext.Provider value={{ mainState, mainDispatch }}>
            {props.children}
        </MainContext.Provider>
    )
}

export default MainProvider