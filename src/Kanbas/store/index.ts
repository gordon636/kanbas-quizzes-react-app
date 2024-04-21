import { configureStore } from "@reduxjs/toolkit";
import assignmentReducer, { IAssignment } from "../Courses/Assignments/assignmentsReducer";
import modulesReducer from "../Courses/Modules/reducer";
import quizzesReducer, { IQuestion, IQuiz } from "../Courses/Quizzes/quizzesReducer";
import usersReducer, { IUser } from "../../Users/reducer";
export interface KanbasState {
    assignmentReducer: {
        assignments: IAssignment[],
        assignment: IAssignment
    };
    modulesReducer: {
        modules: any[];
        module: any;
    };
    quizzesReducer: {
        quizzes: IQuiz[],
        quiz: IQuiz,
        question: IQuestion
    },
    usersReducer: {
        currentUser: IUser
    }
}
const store = configureStore({
    reducer: {
        assignmentReducer,
        modulesReducer,
        quizzesReducer,
        usersReducer
    }
});


export default store;