import { createSlice } from "@reduxjs/toolkit";

export interface IMulitpleChoiceQuestionAnswer {
    answer: string,
    correct: boolean
}

export interface IQuestion {
    title: string,
    question: string,
    questionType: "TRUE_FALSE" | "MULTIPLE_CHOICE" | "FILL_IN",
    points: number,
    mutlipleChoiceQuestionAnswers: IMulitpleChoiceQuestionAnswer[],
    trueFalseAnswer: boolean,
    fillInBlankAnswers: string[]
}

export interface IQuiz {
    _id: string,
    name: string,
    description: string,
    published: boolean,
    course: string,
    quizType: "GRADED_QUIZ" | "PRACTICE_QUIZ" | "GRADED_SURVEY" | "UNGRADED_SURVEY",
    assignmentGroup: "QUIZZES" | "EXAMS" | "ASSIGNMENTS" | "PROJECT",
    shuffleAnswers: boolean,
    timeLimit: number,
    multipleAttempts: boolean,
    showCorrectAnswers: boolean,
    accessCode: string,
    oneQuestionAtATime: boolean,
    webcamRequired: boolean,
    lockQuestionsAfterAnswering: boolean,
    dueDate: Date,
    availableDate: Date,
    untilDate: Date
    questions: IQuestion[]
}

const initialState = {
    quizzes: [] as IQuiz[],
    quiz: null as IQuiz | null,
    question: null as IQuestion | null
};


const quizSlice = createSlice({
    name: "quizzes",
    initialState,
    reducers: {
        setQuizzes: (state, action) => {
            state.quizzes = action.payload;
        },
        addQuiz: (state, action) => {
            state.quizzes = [
                { ...action.payload },
                ...state.quizzes,
            ];
        },
        deleteQuiz: (state, action) => {
            state.quizzes = state.quizzes.filter(
                (quiz) => quiz._id !== action.payload
            );
        },
        updateQuiz: (state, action) => {
            state.quizzes = state.quizzes.map((quiz) => {
                if (quiz._id === action.payload._id) {
                    return action.payload;
                } else {
                    return quiz;
                }
            });
        },
        selectQuiz: (state, action) => {
            state.quiz = action.payload;
        },
        setQuestion: (state, action) => {
            state.question = action.payload;
        }
    },
});


export const { addQuiz, deleteQuiz,
    updateQuiz, selectQuiz, setQuizzes, setQuestion } = quizSlice.actions;
export default quizSlice.reducer;