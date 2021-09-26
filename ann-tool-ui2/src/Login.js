import React from "react";
import { useHistory } from "react-router";

export default function Login(props) {

    const history = useHistory();
    const handleLogin = () => {
        history.push("/workspace")
    }

    return (
        <div onClick={handleLogin} className="cursor-pointer">
            Login Page
        </div>
    );
}