import { FaCheckCircle, FaEdit, FaEllipsisV, FaPlus, FaPlusCircle } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { deleteAssignment, selectAssignment, setAssignments } from "./assignmentsReducer";
import { KanbasState } from "../../store";
import Modal from 'react-bootstrap/Modal';
import * as client from "./client";
import { useState } from "react";

function Assignments() {
    const { courseId } = useParams();
    useEffect(() => {
        if (courseId) {
            client.findAssignmentsForCourse(courseId)
                .then((modules) =>
                    dispatch(setAssignments(modules))
                );
        }
    }, [courseId]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const assignments = useSelector((state: KanbasState) =>
        state.assignmentReducer.assignments);
    const assignmentList = assignments.filter(
        (assignment) => assignment.course === courseId);

    const handleDelete = (assignmentId: string) => {
        const status = client.deleteAssignment(assignmentId);
        dispatch(deleteAssignment(assignmentId));
        handleClose();
    };

    const [show, setShow] = useState<string | null>(null);

    const handleClose = () => setShow(null);
    const handleShow = (assignmentId: string) => setShow(assignmentId);

    return (
        <>
            <Modal show={show !== null} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Assignment!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this assignment?</Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-secondary p-2 m-2" onClick={handleClose}>
                        No
                    </button>
                    <button type="button" className="btn btn-danger p-2 m-2" onClick={() => show ? handleDelete(show) : handleClose}>
                        Yes
                    </button>
                </Modal.Footer>
            </Modal>

            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="col-6">
                        <input id="assignments-textfield" className="form-control w-50" placeholder="Search for Assignments" />
                    </div>

                    <div className="col-6 text-end">
                        <button type="button" className="btn btn-light btn-sm rounded ps-3 pe-3 border"><FaPlus /> Group</button>
                        <button type="button" className="btn btn-danger btn-sm rounded ps-3 pe-3 border"
                            onClick={() => {
                                dispatch(selectAssignment({}));
                                navigate(`/Kanbas/Courses/${courseId}/Assignments/new`)
                            }}><FaPlus /> Assignment</button>
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
                        <FaEllipsisV className="me-2" /> ASSIGNMENTS
                        <span className="float-end">
                            <span className="badge text-dark border border-dark rounded p-1">40% of Total</span>
                            <FaPlusCircle className="ms-2" /><FaEllipsisV className="ms-2" />
                        </span>
                    </div>
                    <ul className="list-group">
                        {assignmentList.map((assignment) => (
                            <>
                                <li className="list-group-item">
                                    <div className="d-flex">
                                        <div style={{ paddingRight: "10px" }}>
                                            <FaEllipsisV className="me-2" />
                                            <FaEdit style={{ color: "green" }} />
                                        </div>
                                        <div style={{ flexGrow: 305 }}>
                                            <Link onClick={() => dispatch(selectAssignment(assignment))}
                                                to={`/Kanbas/Courses/${assignment.course}/Assignments/${assignment._id}`} style={{ color: "black", textDecoration: "none" }}>{assignment.title ? assignment.title : "TBD"}</Link>
                                            <span className="text-muted small"><br />
                                                <span style={{ color: "red" }}>Multiple Module</span> | <b>Due</b> {assignment.dueDate ? assignment.dueDate : "No due date yet"} | {assignment.points ? assignment.points : "-"} pts
                                            </span>
                                        </div>
                                        <button type="button" className="btn btn-danger p-2 m-2"
                                            onClick={() => handleShow(assignment._id)}>
                                            Delete
                                        </button>
                                        <div style={{ flexGrow: 1 }}>
                                            <FaCheckCircle className="text-success" /><FaEllipsisV className="ms-2" />
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
export default Assignments;