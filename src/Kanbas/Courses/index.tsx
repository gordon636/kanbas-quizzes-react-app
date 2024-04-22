import { Link, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { HiChevronRight, HiMiniBars3 } from "react-icons/hi2";
import { useState, useEffect } from "react";
import axios from "axios";
import CourseNavigation from "./Navigation";
import Modules from "./Modules";
import Home from "./Home";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import Grades from "./Grades";
import Quizzes from "./Quizzes";
import { useSelector } from "react-redux";
import { KanbasState } from "../store";
import QuizDetails from "./Quizzes/QuizDetails";
import QuizEditor from "./Quizzes/Editor";
import QuizPreview from "./Quizzes/QuizPreview";

axios.defaults.withCredentials = true;

const API_BASE = process.env.REACT_APP_BASE_API_URL;
function Courses() {
    const { courseId } = useParams();
    const COURSES_API = `${API_BASE}/api/courses`;
    const [course, setCourse] = useState<any>({ _id: "" });
    const findCourseById = async (courseId?: string) => {
        const response = await axios.get(
            `${COURSES_API}/${courseId}`
        );
        setCourse(response.data);
    };
    const assignment = useSelector((state: KanbasState) => state.assignmentReducer.assignment);
    const quiz = useSelector((state: KanbasState) => state.quizzesReducer.quiz);
    const user = useSelector((state: KanbasState) => state.usersReducer.currentUser);

    useEffect(() => {
        findCourseById(courseId);
    }, [courseId]);
    const { pathname } = useLocation();
    const pathArray = pathname.split("/");
    const breadcrumb = pathArray[4];

    return (
        <div>
            <div className="row">
                <div className="row col-9 p-1">
                    <h3><HiMiniBars3 color="red" style={{ margin: "10px" }} />
                        <Link to={`/Kanbas/Courses/${courseId}/Home`} style={{ textDecoration: "none", color: "red" }}>
                            {course?.number} {course?.name}
                        </Link>
                        {/* This is a little hacky -> should update to use some state management to track breadcrumbs better */}
                        {(breadcrumb === "Assignments" || breadcrumb === "Quizzes") && pathArray.length > 5 ?
                            <>
                                <Link to={`/Kanbas/Courses/${courseId}/${breadcrumb}`} style={{ textDecoration: "none", color: "red" }}>
                                    <HiChevronRight />{breadcrumb}
                                </Link>
                                <HiChevronRight /> {breadcrumb === "Assignments" ? assignment?.title : quiz?.name}
                            </>
                            :
                            <>
                                <HiChevronRight />{breadcrumb}
                            </>
                        }
                    </h3>
                </div>
                <div className="row col-3 text-end p-3">
                    {user ? `Logged in as ${user.username} (${user.role})` : <><Link to={`/Kanbas/Account/SignIn`}>Login</Link></>}
                </div>
            </div>

            <hr />
            <CourseNavigation />
            <div>
                <div
                    className="overflow-y-scroll position-fixed bottom-0 end-0"
                    style={{ left: "250px", top: "100px" }} >
                    <Routes>
                        <Route path="/" element={<Navigate to="Home" />} />
                        <Route path="Home" element={<Home />} />
                        <Route path="Modules" element={<Modules />} />
                        <Route path="Piazza" element={<h1>Piazza</h1>} />
                        <Route path="Assignments" element={<Assignments />} />
                        <Route path="Assignments/:assignmentId" element={<AssignmentEditor />} />
                        <Route path="Quizzes" element={<Quizzes />} />
                        <Route path="Quizzes/:quizId" element={<QuizDetails />} />
                        <Route path="Quizzes/:quizId/edit" element={<QuizEditor />} />
                        <Route path="Quizzes/:quizId/preview" element={<QuizPreview />} />
                        <Route path="Grades" element={<Grades />} />
                    </Routes>
                </div>
            </div>

        </div >
    );
}
export default Courses;