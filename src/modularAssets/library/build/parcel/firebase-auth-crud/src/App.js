import {  } from "react"
import Main from "./components/main.component"
import MainProvider from "./context/MainContext"

export function App() {
    return (
        <MainProvider>
            <Main />
        </MainProvider>
    )
}
