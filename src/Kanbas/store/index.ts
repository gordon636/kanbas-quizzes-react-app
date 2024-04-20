import { configureStore } from "@reduxjs/toolkit";
import assignmentReducer, { IAssignment } from "../Courses/Assignments/assignmentsReducer";
import modulesReducer from "../Courses/Modules/reducer";
export interface KanbasState {
    assignmentReducer: {
        assignments: IAssignment[],
        assignment: IAssignment
    };
    modulesReducer: {
        modules: any[];
        module: any;
    };
}
const store = configureStore({
    reducer: {
        assignmentReducer,
        modulesReducer
    }
});


export default store;