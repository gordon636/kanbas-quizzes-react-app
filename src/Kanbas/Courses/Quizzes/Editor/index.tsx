import { FaBan, FaCheckCircle, FaEllipsisV } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { KanbasState } from "../../../store";
import { IQuiz, selectQuiz, updateQuiz } from "../quizzesReducer";
import * as client from "../client";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import QuizDetailsEditor from "./DetailsEditor";
import { Nav, NavItem } from "react-bootstrap";
import QuizQuestionsEditor from "./QuestionsEditor";

export function QuizEditorFooter(props: { isTimeLimit: boolean, quiz: IQuiz }) {
    const { isTimeLimit, quiz } = props;
    const { courseId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSave = async (autoPublish = false) => {
        const updatedQuiz: IQuiz = {
            ...quiz,
            timeLimit: isTimeLimit ? quiz.timeLimit : 0,
            published: autoPublish ? true : quiz.published
        }
        await client.updateQuiz(updatedQuiz);
        dispatch(updateQuiz(updatedQuiz));
        navigate(`/Kanbas/Courses/${courseId}/Quizzes`);
    };

    return (
        <>
            <hr />
            <div className="col-12 d-flex align-items-start p-3 m-3">
                <Link to={`/Kanbas/Courses/${courseId}/Quizzes`}
                    className="btn btn-light float-end m-2">
                    Cancel
                </Link>
                <button onClick={() => handleSave(true)} className="btn btn-light m-2 float-end">
                    Save & Publish
                </button>
                <button onClick={() => handleSave()} className="btn btn-danger m-2 float-end">
                    Save
                </button>

            </div>


            <hr />
        </>
    );

}

function QuizEditor() {
    const { quizId } = useParams();
    const dispatch = useDispatch();
    const [currentTab, setCurrentTab] = useState<"Details" | "Questions">("Details");

    const [isLoading, setLoading] = useState(true);

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

    if (isLoading) {
        return <h3>Loading...</h3>;
    }

    return (
        <div className="container-fluid">
            <div className="col-12 text-end">
                Points {quiz.questions.length > 0 ? `${quiz.questions.reduce((totalPoints, { points }) => totalPoints + points, 0)}` : "0"}&emsp;
                {quiz.published ?
                    <span className="text-muted"><FaCheckCircle /> Published </span> :
                    <span className="text-muted"><FaBan /> Not Published </span>
                }&emsp;
                <button type="button" className="btn btn-light btn-sm rounded pl-0 ps-3 pe-3 border">
                    <FaEllipsisV />
                </button>
            </div>
            <Nav className="nav nav-tabs mt-2">
                <NavItem className={`nav-link ${currentTab === "Details" ? "active" : "text-danger"}`} onClick={() => setCurrentTab("Details")}>Details</NavItem>
                <NavItem className={`nav-link ${currentTab === "Questions" ? "active" : "text-danger"}`} onClick={() => setCurrentTab("Questions")}>Questions</NavItem>
            </Nav>
            {currentTab === "Details" ?
                <QuizDetailsEditor /> :
                <QuizQuestionsEditor />
            }
        </div>
    );
}
export default QuizEditor;