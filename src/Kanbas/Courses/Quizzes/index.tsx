import { FaBan, FaCheckCircle, FaChevronDown, FaEdit, FaEllipsisV, FaPlus } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { IQuiz, deleteQuiz, selectQuiz, setQuizzes, updateQuiz } from "./quizzesReducer";
import { KanbasState } from "../../store";
import Modal from 'react-bootstrap/Modal';
import * as client from "./client";
import { useState } from "react";
import moment from "moment";

function QuizAvailability(props: { quiz: IQuiz }) {
    if (moment().diff(props.quiz.untilDate) > 0) {
        return <strong>Closed</strong>;
    }
    if (moment().diff(props.quiz.availableDate) > 0) {
        return <strong>Available</strong>;
    }
    return <strong>`Not Available Until ${new Date(props.quiz.availableDate).toString()}`</strong>;
}

function Quizzes() {
    const { courseId } = useParams();
    useEffect(() => {
        if (courseId) {
            client.findQuizzesForCourse(courseId)
                .then((modules) =>
                    dispatch(setQuizzes(modules))
                );
        }
    }, [courseId]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state: KanbasState) => state.usersReducer.currentUser)
    const quizzes = useSelector((state: KanbasState) => state.quizzesReducer.quizzes);
    const quizList = quizzes.filter(
        (quiz) => quiz.course === courseId);

    const handleCreate = async () => {
        if (courseId) {
            const newQuiz = await client.createQuiz(courseId, { name: `Unnamed Quiz` });
            dispatch(selectQuiz(newQuiz));
            navigate(`/Kanbas/Courses/${courseId}/Quizzes/${newQuiz._id}`)
        }
    }

    const handleDelete = async (quizId: string) => {
        const status = await client.deleteQuiz(quizId);
        dispatch(deleteQuiz(quizId));
        handleCloseDelete();
    };

    const handleChangePublishValue = async (quiz: IQuiz, newPublishStatus: boolean) => {
        const newQuiz: IQuiz = { ...quiz, published: newPublishStatus };
        const updatedQuiz = await client.updateQuiz(newQuiz);
        dispatch(updateQuiz(newQuiz));
        setShowMenu(null);
    };

    const [showDelete, setShowDelete] = useState<string | null>(null);

    const handleCloseDelete = () => setShowDelete(null);
    const handleShowDelete = (quizId: (string | null)) => {
        setShowDelete(quizId);
        setShowMenu(null);
    }

    const [showMenu, setShowMenu] = useState<IQuiz | null>(null);
    const handleCloseMenu = () => setShowMenu(null);
    const handleShowMenu = (quiz: IQuiz) => setShowMenu(quiz);

    return (
        <>
            <Modal show={showDelete !== null} onHide={handleCloseDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Quiz!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this quiz?</Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-secondary p-2 m-2" onClick={handleCloseDelete}>
                        No
                    </button>
                    <button type="button" className="btn btn-danger p-2 m-2" onClick={() => showDelete ? handleDelete(showDelete) : handleCloseDelete}>
                        Yes
                    </button>
                </Modal.Footer>
            </Modal>

            <Modal show={showMenu !== null} onHide={handleCloseMenu}>
                {showMenu ?
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>{showMenu.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <button type="button" className="btn btn-light btn-sm rounded m-3 pl-0 ps-3 pe-3 border">Edit</button>
                            {showMenu.published ?
                                <button type="button" className="btn btn-danger btn-sm rounded ps-3 pe-3 border" onClick={() => handleChangePublishValue(showMenu, false)}><FaBan /> Unpublish</button> :
                                <button type="button" className="btn btn-success btn-sm rounded ps-3 pe-3 border" onClick={() => handleChangePublishValue(showMenu, true)}><FaCheckCircle /> Publish</button>
                            }
                            <button type="button" className="btn btn-danger btn-sm rounded m-3 pl-0 ps-3 pe-3 border" onClick={() => handleShowDelete(showMenu._id)}>Delete</button>
                        </Modal.Body>
                    </>
                    :
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>Error! No Quiz selected!</Modal.Title>
                        </Modal.Header>
                    </>
                }
            </Modal>

            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="col-6">
                        <input id="quizzes-textfield" className="form-control w-50" placeholder="Search for Quizzes" />
                    </div>

                    <div className="col-6 text-end">
                        {user && user.role === "FACULTY" &&
                            <button type="button" className="btn btn-danger btn-sm rounded ps-3 pe-3 border"
                                onClick={() => handleCreate()}><FaPlus /> Quiz</button>
                        }
                        <button type="button" className="btn btn-light btn-sm rounded pl-0 ps-3 pe-3 border">
                            <FaEllipsisV />
                        </button>
                    </div>
                </div>
            </div>

            <hr />
            <ul className="list-group wd-modules">
                <li className="list-group-item">
                    <div>
                        <FaChevronDown className="me-2" />Assignment Quizzes
                    </div>
                    <ul className="list-group">
                        {quizList.map((quiz) => (((user && user.role === "FACULTY") || quiz.published) &&
                            <>
                                <li key={quiz._id} className="list-group-item">
                                    <div className="d-flex">
                                        <div style={{ paddingRight: "10px" }}>
                                            <FaEllipsisV className="me-2" />
                                            <FaEdit style={{ color: "green" }} />
                                        </div>
                                        <div style={{ flexGrow: 305 }}>
                                            <Link onClick={() => dispatch(selectQuiz(quiz))}
                                                to={`/Kanbas/Courses/${quiz.course}/Quizzes/${quiz._id}`} style={{ color: "black", textDecoration: "none" }}>{quiz.name}</Link>
                                            <span className="text-muted small"><br />
                                                <QuizAvailability quiz={quiz} />&emsp;
                                                <b>Due</b> {moment(quiz.dueDate).format('MMM DD')} at {moment(quiz.dueDate).format('h:mma')}

                                                &emsp;
                                                {(quiz.published && quiz.questions.length > 0) ? `${quiz.questions.reduce((totalPoints, { points }) => totalPoints + points, 0)} pts \t ${quiz.questions.length} Questions` : ""}
                                            </span>
                                        </div>
                                        <div style={{ flexGrow: 1 }}>
                                            {quiz.published ?
                                                <FaCheckCircle className="text-success" onClick={() => handleChangePublishValue(quiz, false)} /> :
                                                <FaBan onClick={() => handleChangePublishValue(quiz, true)} />
                                            }
                                            <FaEllipsisV className="ms-2" onClick={() => handleShowMenu(quiz)} />
                                        </div>
                                    </div>
                                </li >
                            </>
                        ))}
                    </ul>
                </li >
            </ul >
        </>
    );
}
export default Quizzes;