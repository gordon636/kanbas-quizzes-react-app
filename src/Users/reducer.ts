import { createSlice } from "@reduxjs/toolkit";

export interface IUser {
    _id: string,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    email: string,
    dob: Date,
    role: "STUDENT" | "FACULTY" | "ADMIN" | "USER"
}

const initialState = {
    currentUser: null as IUser | null,
};


const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.currentUser = action.payload;
        }
    },
});


export const { setUser } = userSlice.actions;
export default userSlice.reducer;