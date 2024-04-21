import { FaBan, FaCheckCircle, FaEllipsisV } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { KanbasState } from "../../store";
import { BsPencil } from "react-icons/bs";
import { IQuiz, selectQuiz } from "./quizzesReducer";
import * as client from "./client";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment";

function QuizDetails() {
    const { courseId, quizId } = useParams();
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        if (quizId) {
            client.getQuizById(quizId).then((quiz) => {
                dispatch(selectQuiz(quiz))
                setLoading(false);
            });
        }
    }, []);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const quiz = useSelector((state: KanbasState) =>
        state.quizzesReducer.quiz);
    const user = useSelector((state: KanbasState) =>
        state.usersReducer.currentUser);

    const handleChangePublishValue = async (quiz: IQuiz, newPublishStatus: boolean) => {
        const newQuiz: IQuiz = { ...quiz, published: newPublishStatus };
        await client.updateQuiz(newQuiz);
        dispatch(selectQuiz(newQuiz));
    };

    if (isLoading) {
        return <h3>Loading...</h3>;
    }

    return (
        <>
            <div className="container-fluid">
                <div className="col-12 text-end">
                    {user && user.role === "FACULTY" && quiz.published ?
                        <button type="button" className="btn btn-success btn-sm rounded ps-3 pe-3 border" onClick={() => handleChangePublishValue(quiz, false)}><FaCheckCircle /> Published</button> :
                        <button type="button" className="btn btn-danger btn-sm rounded ps-3 pe-3 border" onClick={() => handleChangePublishValue(quiz, true)}><FaBan /> Unpublished</button>
                    }
                    <button type="button" className="btn btn-sm rounded ps-3 pe-3 border" onClick={() => navigate(`/Kanbas/Courses/${courseId}/Quizzes/${quizId}/preview`)}>{user && user.role === "FACULTY" ? 'Preview' : 'Take Quiz'}</button>
                    {user && user.role === "FACULTY" &&
                        <>
                            <button type="button" className="btn btn-sm rounded ps-3 pe-3 border" onClick={() => navigate(`/Kanbas/Courses/${courseId}/Quizzes/${quizId}/edit`)}><BsPencil /> Edit</button>
                            <button type="button" className="btn btn-light btn-sm rounded pl-0 ps-3 pe-3 border">
                                <FaEllipsisV />
                            </button>
                        </>
                    }
                </div>
            </div>

            <hr />
            <h1>{quiz.name}</h1>
            <br />
            <div className="container-fluid col-12 row">
                <div className="col-3 font-weight-bold text-end">
                    <ul className="list-unstyled">
                        <li><strong>Quiz Type</strong></li>
                        <li><strong>Points</strong></li>
                        <li><strong>Assignment Group</strong></li>
                        <li><strong>Shuffle Answers</strong></li>
                        <li><strong>Time Limit</strong></li>
                        <li><strong>Multiple Attempts</strong></li>
                        <li><strong>Show Correct Answers</strong></li>
                        <li><strong>Access Code</strong></li>
                        <li><strong>One Question at a Time</strong></li>
                        <li><strong>Webcam Required</strong></li>
                        <li><strong>Lock Questions After Answering</strong></li>
                    </ul>
                </div>
                <div className="col-9">
                    <ul className="list-unstyled">
                        <li>{quiz.quizType.replace("_", " ")}</li>
                        <li>{quiz.questions.length > 0 ? `${quiz.questions.reduce((totalPoints, { points }) => totalPoints + points, 0)}` : "0"}</li>
                        <li>{quiz.assignmentGroup}</li>
                        <li>{String(quiz.shuffleAnswers)}</li>
                        <li>{quiz.timeLimit ? `${quiz.timeLimit.toString()} minutes` : "No Limit"}</li>
                        <li>{String(quiz.multipleAttempts)}</li>
                        <li>{String(quiz.showCorrectAnswers)}</li>
                        <li>{quiz.accessCode ? quiz.accessCode : "-"}</li>
                        <li>{String(quiz.oneQuestionAtATime)}</li>
                        <li>{String(quiz.webcamRequired)}</li>
                        <li>{String(quiz.lockQuestionsAfterAnswering)}</li>
                    </ul>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Due</th>
                            <th>Available From</th>
                            <th>Available Until</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{moment(quiz.dueDate).format('MMM DD')} at {moment(quiz.dueDate).format('h:mma')}</td>
                            <td>{moment(quiz.availableDate).format('MMM DD')} at {moment(quiz.availableDate).format('h:mma')}</td>
                            <td>{moment(quiz.untilDate).format('MMM DD')} at {moment(quiz.untilDate).format('h:mma')}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}
export default QuizDetails;