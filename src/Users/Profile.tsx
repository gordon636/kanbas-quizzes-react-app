import moment from 'moment'
import * as client from "./client";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setUser } from './reducer';
export default function Profile() {
    const dispatch = useDispatch();
    const [profile, setProfile] = useState({
        _id: "",
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        dob: "",
        email: "",
        role: "USER"
    });
    const navigate = useNavigate();
    const fetchProfile = async () => {
        const account = await client.profile();
        setProfile(account);
    };
    const save = async () => {
        await client.updateUser(profile);
    };
    const signout = async () => {
        await client.signout();
        dispatch(setUser(null));
        navigate("/Kanbas/Account/Signin");
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const dob = profile ? moment(profile.dob).isValid() ? moment(profile.dob).format("YYYY-MM-DD") : "" : "";
    return (
        <div>
            <h1>Profile</h1>
            <Link to="/Kanbas/Account/Admin/Users"
                className="btn btn-warning w-auto mb-3">
                Users
            </Link>
            {
                profile && (
                    <div>
                        <input className="form-control w-auto mb-3" value={profile.username} onChange={(e) =>
                            setProfile({ ...profile, username: e.target.value })} />
                        <input className="form-control w-auto mb-3" value={profile.password} onChange={(e) =>
                            setProfile({ ...profile, password: e.target.value })} />
                        <input className="form-control w-auto mb-3" value={profile.firstName} onChange={(e) =>
                            setProfile({ ...profile, firstName: e.target.value })} />
                        <input className="form-control w-auto mb-3" value={profile.lastName} onChange={(e) =>
                            setProfile({ ...profile, lastName: e.target.value })} />
                        <input className="form-control w-auto mb-3" value={dob} type="date" onChange={(e) =>
                            setProfile({ ...profile, dob: e.target.value })} />
                        <input className="form-control w-auto mb-3" value={profile.email} onChange={(e) =>
                            setProfile({ ...profile, email: e.target.value })} />
                        <select className="form-control w-auto mb-3" onChange={(e) =>
                            setProfile({ ...profile, role: e.target.value })}>
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                            <option value="FACULTY">Faculty</option>
                            <option value="STUDENT">Student</option>
                        </select>
                        <button className="btn btn-primary w-auto mb-3" onClick={save}>Save</button><br />
                        <button className="btn btn-danger w-auto" onClick={signout}>Signout</button>
                    </div>
                )
            }
        </div >
    );
}
