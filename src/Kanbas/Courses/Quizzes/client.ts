import axios from "axios";
import { IQuiz } from "./quizzesReducer";

const API_BASE = process.env.REACT_APP_BASE_API_URL;
const COURSES_API = `${API_BASE}/api/courses`;
const QUIZZES_API = `${API_BASE}/api/quizzes`;
export const deleteQuiz = async (quizId: string) => {
    const response = await axios
        .delete(`${QUIZZES_API}/${quizId}`);
    return response.data;
};
export const findQuizzesForCourse = async (courseId: string) => {
    const response = await axios
        .get(`${COURSES_API}/${courseId}/quizzes`);
    return response.data;
};

export const createQuiz = async (courseId: string, quiz: { name: String }) => {
    const response = await axios.post(
        `${COURSES_API}/${courseId}/quizzes`,
        quiz
    );
    return response.data;
};

export const updateQuiz = async (quiz: IQuiz) => {
    const response = await axios.
        put(`${QUIZZES_API}/${quiz._id}`, quiz);
    return response.data;
};

export const getQuizById = async (quizId: string) => {
    const response = await axios
        .get(`${QUIZZES_API}/${quizId}`);
    return response.data;
};