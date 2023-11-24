import { useContext } from 'react'
import { MainContext } from './context/main/MainState'
import { GlobalContext } from './context/global/GlobalState'

import {
    /* Assets */
    /* Database */
    /* Helper Functions */
    /* Components */
    /* Icons */
} from './export-hub'

const !!NAME!! = (props) => {
    const {
        state: { display },
        dispatch,
    } = useContext(MainContext)
    const {
        state: { userObj },
        globalDispatch,
    } = useContext(GlobalContext)

    return (
        <div>
            <button onClick={callFunc}>Toggle Me</button>
            I'm a card!
        </div>
    )
}

export default !!NAME!!
