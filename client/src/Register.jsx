import { useContext, useState } from "react";
import axios from 'axios';
import { UserContext } from "./UserContext";

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const {setUsername:setLoggedInUsername, setId} = useContext(UserContext);
    const [isLoginOrRegister, setIsLoginOrRegister ] = useState('register');
    

    async function register(e){
        e.preventDefault();
        try {
            const {data} = await axios.post('/register', {username, password}, { withCredentials:true });
            setLoggedInUsername(username);
            setId(data.id);
        } catch (error) {
            console.error(error);
        }
    }


    return(
        <div className="bg-blue-100 h-screen flex items-center">
            <form className="w-64 mx-auto mb-12" onSubmit={register}>
                <input  value={username} 
                        onChange={e => setUsername(e.target.value)} 
                        type="text" placeholder="username" 
                        className="block w-full rounded-sm p-2 mb-2 border">
                </input>
                <input  value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        type="password" placeholder="password" 
                        className="block w-full rounded-sm p-2 mb-2 border">
                </input>
                <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
                   { isLoginOrRegister === 'register' ? 'Register' : 'Login'}
                </button>
                <div className="text-center mt-2">
                    Already a member? 
                    <button onClick= { () => setIsLoginOrRegister('login') } >
                        Login here
                    </button>
                </div>
            </form>
        </div>
    )
}