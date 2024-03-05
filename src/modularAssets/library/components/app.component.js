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

    const callFunc = () => {
        dispatch({
            type: 'TOG_MODAL'
        })
    }

    const changeUser = () => {
        globalDispatch({
            type: 'CHANGE_USER',
        })
    }

    return (
        <div>
            <button onClick={callFunc}>Toggle Me</button>
            {display.isModalOpen && (
                <div
                    style={{
                        width: '200px',
                        height: '200px',
                        backgroundColor: 'lightblue',
                    }}>
                    I'm a Modal
                    <br />
                    <button onClick={changeUser}>Change Me</button>
                    <br />
                    {userObj.name}
                </div>
            )}
        </div>
    )
}

export default !!NAME!!
