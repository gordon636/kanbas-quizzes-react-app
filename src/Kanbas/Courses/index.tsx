import { db } from "../../Kanbas/Database";
import { Link, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { HiChevronRight, HiMiniBars3 } from "react-icons/hi2";
import { FaGlasses } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import CourseNavigation from "./Navigation";
import Modules from "./Modules";
import Home from "./Home";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import Grades from "./Grades";

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
    useEffect(() => {
        findCourseById(courseId);
    }, [courseId]);
    const { pathname } = useLocation();
    const pathArray = pathname.split("/");
    const breadcrumb = pathArray[4];

    return (
        <div>
            <h3 style={{ padding: "10px" }}><HiMiniBars3 color="red" style={{ margin: "10px" }} />
                <Link to={`/Kanbas/Courses/${courseId}/Home`} style={{ textDecoration: "none", color: "red" }}>
                    {course?.number} {course?.name}
                </Link>
                {/* This is a little hacky -> should update to use some state management to track breadcrumbs better */}
                {breadcrumb === "Assignments" && pathArray.length > 5 ?
                    <>
                        <Link to={`/Kanbas/Courses/${courseId}/Assignments`} style={{ textDecoration: "none", color: "red" }}>
                            <HiChevronRight />{breadcrumb}
                        </Link>
                        <HiChevronRight /> {db.assignments.find((assignment) => assignment._id === pathArray[5])?.title}
                    </>
                    :
                    <>
                        <HiChevronRight />{breadcrumb}
                    </>
                }

                <button style={{ float: "right", margin: "3px", borderRadius: "10px" }}><FaGlasses /> Student View</button>
            </h3>
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
                        <Route path="Grades" element={<Grades />} />
                    </Routes>
                </div>
            </div>

        </div >
    );
}
export default Courses;