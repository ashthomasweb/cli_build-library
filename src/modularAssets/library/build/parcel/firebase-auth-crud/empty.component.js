import { useContext } from 'react'
import { MainContext } from '../context/MainContext'

export default function NEW() {
    const {
        mainState: {
        },
        mainDispatch
    } = useContext(MainContext)

    return (
        <div>
        </div>
    )
}