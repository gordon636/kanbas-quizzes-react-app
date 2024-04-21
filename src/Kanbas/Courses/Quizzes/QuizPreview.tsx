import { FaBan, FaCheckCircle, FaEllipsisV, FaExclamationCircle, FaPencilAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { KanbasState } from "../../store";
import { BsPencil } from "react-icons/bs";
import { IMulitpleChoiceQuestionAnswer, IQuestion, IQuiz, selectQuiz } from "./quizzesReducer";
import * as client from "./client";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment";
import { Form } from "react-bootstrap";
import parse from 'html-react-parser';

function QuizPreview() {
    const { courseId, quizId } = useParams();
    const [isLoading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        if (quizId) {
            client.getQuizById(quizId).then((quiz) => {
                dispatch(selectQuiz(quiz))
                setLoading(false);
            });
        }
    }, []);

    const quiz = useSelector((state: KanbasState) =>
        state.quizzesReducer.quiz);
    const user = useSelector((state: KanbasState) =>
        state.usersReducer.currentUser);

    if (isLoading) {
        return <h3>Loading...</h3>;
    }

    return (
        <>
            <div className="container-fluid">
                <h1>{quiz.name}</h1>
                {user && user.role === "FACULTY" &&
                    <div className="border p-2 m-2" style={{ backgroundColor: '#f8d7da', color: '#721c24' }}>
                        <FaExclamationCircle /> This is a preview of the quiz
                    </div>
                }
                {quiz.oneQuestionAtATime ? <QuizPreviewOneQuestion /> : <QuizPreviewAllQuestions />}
            </div>
        </>
    );
}
export default QuizPreview;

function QuizPreviewAllQuestions() {
    const { courseId, quizId } = useParams();
    const quiz = useSelector((state: KanbasState) =>
        state.quizzesReducer.quiz);
    const user = useSelector((state: KanbasState) =>
        state.usersReducer.currentUser);
    const navigate = useNavigate();

    return (
        <div className="container-fluid col-12 row m-2">
            {quiz.questions.map((question) => {
                return (
                    <>
                        <QuestionPreview question={question} />
                        <hr />
                    </>
                );
            })}
            <div className="col-12 border text-end mt-3">
                <button type="button" className="border btn btn-light p-2 m-2" onClick={() => navigate(`/Kanbas/courses/${courseId}/Quizzes/${quizId}/`)}>Submit Quiz</button>
            </div>
            {user && user.role === "FACULTY" &&
                <div className="col-12 border bg-light mt-3" onClick={() => navigate(`/Kanbas/courses/${courseId}/Quizzes/${quizId}/edit`)}>
                    <p><FaPencilAlt />Keep Editing this Quiz</p>
                </div>
            }
        </div>
    );
}

function QuizPreviewOneQuestion() {
    const { courseId, quizId } = useParams();
    const quiz = useSelector((state: KanbasState) =>
        state.quizzesReducer.quiz);
    const user = useSelector((state: KanbasState) =>
        state.usersReducer.currentUser);
    const navigate = useNavigate();

    const [currentQuestion, setCurrentQuestion] = useState<number>(0);

    if (quiz.questions.length < 1) {
        return (
            <>
                There are no questions yet!
                {user && user.role === "FACULTY" &&
                    <div className="col-12 border bg-light mt-3" onClick={() => navigate(`/Kanbas/courses/${courseId}/Quizzes/${quizId}/edit`)}>
                        <p><FaPencilAlt />Keep Editing this Quiz</p>
                    </div>
                }
            </>
        );
    }

    return (
        <>
            <QuestionPreview question={quiz.questions[currentQuestion]} />
            <hr />
            <div className="container-fluid col-12 row">
                <div className="col-6">

                    {currentQuestion > 0 &&
                        <button type="button" className="btn btn-light p-2 m-2" onClick={() => setCurrentQuestion(currentQuestion - 1)}>Previous Question</button>
                    }
                </div>
                <div className="col-6 text-end">
                    {quiz.questions.length > currentQuestion + 1 &&
                        <button type="button" className="btn btn-light p-2 m-2" onClick={() => setCurrentQuestion(currentQuestion + 1)}>Next Question</button>
                    }
                </div>
                <div className="col-12 border text-end mt-3">
                    <button type="button" className="border btn btn-light p-2 m-2" onClick={() => navigate(`/Kanbas/courses/${courseId}/Quizzes/${quizId}/`)}>Submit Quiz</button>
                </div>
                {user && user.role === "FACULTY" &&
                    <div className="col-12 border bg-light mt-3" onClick={() => navigate(`/Kanbas/courses/${courseId}/Quizzes/${quizId}/edit`)}>
                        <p><FaPencilAlt />Keep Editing this Quiz</p>
                    </div>
                }
            </div>

        </>
    );
}

export function QuestionPreview(props: { question: IQuestion }) {
    const { question } = props;

    console.log(question);

    if (!question) {
        return <></>;
    }
    return (
        <div className="container-fluid border">
            <div className="container-fluid col-12 row bg-light d-flex w-100">
                <div className="col-6">
                    <h3 className="d-inline">{question.title}</h3>
                </div>
                <div className="col-6 text-end">
                    <h3 className="d-inline">{question.points} {question.points === 1 ? 'pt' : 'pts'}</h3>
                </div>
            </div>
            <div className="col-12 m-3">
                <pre>{parse(question.question)}</pre>
            </div>
            <div className="col-12">
                {question.questionType === "MULTIPLE_CHOICE" ?
                    <>
                        <MultipleChoiceQuestionPreview question={question} />
                    </> :
                    question.questionType === "TRUE_FALSE" ?
                        <TrueFalseQuestionPreview /> :
                        <FillInQuestionPreview question={question} />
                }
            </div>
        </div>
    );
}

function MultipleChoiceQuestionPreview(props: { question: IQuestion }) {
    const { question } = props;

    const [selectedAnswer, setSelectedAnswer] = useState<IMulitpleChoiceQuestionAnswer | null>(null);

    return (
        <>
            <p>Select the correct answer</p>
            {question.mutlipleChoiceQuestionAnswers.map((a) =>
                <>
                    <hr />
                    <label className="mb-2">
                        <input
                            type="radio"
                            name="answer"
                            value={a.answer}
                            checked={selectedAnswer ? selectedAnswer.answer === a.answer : false}
                            onChange={() => setSelectedAnswer(a)}
                        />
                        &emsp;{a.answer}
                    </label>
                </>
            )}
            <br />
        </>
    );
}

function TrueFalseQuestionPreview() {
    const [trueFalse, setTrueFalse] = useState<boolean | null>(null);

    return (
        <>
            <Form.Check
                type="radio"
                label="True"
                checked={trueFalse !== null ? trueFalse : false}
                onChange={() => setTrueFalse(true)}
                inline
            />
            <br />
            <Form.Check
                type="radio"
                label="False"
                checked={trueFalse !== null ? !trueFalse : false}
                onChange={() => setTrueFalse(false)}
                inline
            />
        </>

    );
}

function FillInQuestionPreview(props: { question: IQuestion }) {
    const { question } = props;

    const [answers, setAnswers] = useState<string[]>([]);

    return (
        <>
            <p>Enter your answer for each blank</p>
            {question.fillInBlankAnswers.map((a, i) =>
                <>
                    <hr />
                    <label className="mb-2">
                        <input
                            type="text"
                            name="answer"
                            value={answers[i]}
                            onChange={(e) => setAnswers([...answers.slice(0, i), e.target.value, ...answers.slice(i + 1)])}
                        />
                    </label>
                </>
            )}
            <br />
        </>
    );
}