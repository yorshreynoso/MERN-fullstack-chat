import { useContext } from "react";
import UserContext from "./UserContext";
import Register from "./Register";

export default function Route() {
    const {username , id} = useContext(UserContext);

    if(username) {
        return 'logged in! '+ username;
    }
    return(
        <div>
            <Register />

        </div>
    )
}