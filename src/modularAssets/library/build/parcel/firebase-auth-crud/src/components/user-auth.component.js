import AuthInterface from '../interfaces/auth.interface'

export default function UserAuth() {
    const userLogin = () => {
        AuthInterface.userLogin()
    }
    
    const userLogout = () => {
        AuthInterface.userLogout()
    }

    return (
        <div className='modal-basic-style' >
            <h2>User Authentication</h2>
            <button type='button' onClick={userLogin}>Login</button>
            <hr />
            <button type='button' onClick={userLogout}>Logout</button>
        </div>
    )
}