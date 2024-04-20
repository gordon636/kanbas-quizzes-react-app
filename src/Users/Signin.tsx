import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "./client";
import * as client from "./client";

export default function Signin() {
    const [credentials, setCredentials] = useState<User>({
        _id: "",
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        dob: "",
        role: "USER"
    });
    const navigate = useNavigate();
    const signin = async () => {
        await client.signin(credentials);
        navigate("/Kanbas/Account/Profile");
    };
    return (
        <div>
            <h1>Signin</h1>
            <input className="form-control w-auto mb-3" value={credentials.username} placeholder="Username" onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })} />
            <input className="form-control w-auto mb-3" value={credentials.password} placeholder="Password" onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })} />
            <button className="btn btn-primary mb-3" onClick={signin}> Signin </button>
        </div>
    );
}
