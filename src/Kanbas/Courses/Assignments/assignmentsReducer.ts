import { createSlice } from "@reduxjs/toolkit";

export interface IAssignment {
    _id: string,
    title: string,
    course: string,
    description: string,
    points: number,
    dueDate: string,
    availableFromDate: string,
    availableUntilDate: string
}

const initialState = {
    assignments: [] as IAssignment[],
    assignment: { title: "New Assignment 123", course: "RS101" },
};


const assignmentSlice = createSlice({
    name: "assignments",
    initialState,
    reducers: {
        setAssignments: (state, action) => {
            state.assignments = action.payload;
        },
        addAssignment: (state, action) => {
            state.assignments = [
                { ...action.payload, _id: new Date().getTime().toString() },
                ...state.assignments,
            ];
        },
        deleteAssignment: (state, action) => {
            state.assignments = state.assignments.filter(
                (assignment) => assignment._id !== action.payload
            );
        },
        updateAssignment: (state, action) => {
            state.assignments = state.assignments.map((assignment) => {
                if (assignment._id === action.payload._id) {
                    return action.payload;
                } else {
                    return assignment;
                }
            });
        },
        selectAssignment: (state, action) => {
            state.assignment = action.payload;
        },
    },
});


export const { addAssignment, deleteAssignment,
    updateAssignment, selectAssignment, setAssignments } = assignmentSlice.actions;
export default assignmentSlice.reducer;