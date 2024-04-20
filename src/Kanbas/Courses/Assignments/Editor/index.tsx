import { useNavigate, useParams, Link } from "react-router-dom";
import { FaCheckCircle, FaEllipsisV } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
    addAssignment,
    updateAssignment,
    selectAssignment
} from "../assignmentsReducer";
import * as client from "../client";
import { KanbasState } from "../../../store";


function AssignmentEditor() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const assignment = useSelector((state: KanbasState) =>
        state.assignmentReducer.assignment);

    const handleSave = async () => {
        if (!assignment.course && courseId) {
            const status = await client.createAssignment(courseId, assignment);
            dispatch(addAssignment({ ...assignment, course: courseId }));
        } else {
            const status = await client.updateAssignment(assignment);
            dispatch(updateAssignment(assignment));
        }
        navigate(`/Kanbas/Courses/${courseId}/Assignments`);
    };
    return (
        <div>
            <div className="d-flex justify-content-end align-items-center gap-2 mb-3 p-3">
                <p className="text-success"><FaCheckCircle /> Published</p>
                <button type="button" className="btn btn-light btn-sm rounded pl-0 ps-3 pe-3 border"><FaEllipsisV /></button>
            </div>
            <hr />
            <h2>Name</h2>
            <input value={assignment?.title}
                className="form-control mb-2" onChange={(e) => dispatch(selectAssignment({ ...assignment, title: e.target.value }))}
            />

            <h4>Description</h4>
            <input value={assignment?.description}
                className="form-control mb-2" onChange={(e) => dispatch(selectAssignment({ ...assignment, description: e.target.value }))} />

            <h4>Points</h4>
            <input type="number" value={assignment?.points}
                className="form-control mb-2" onChange={(e) => dispatch(selectAssignment({ ...assignment, points: e.target.value }))} />


            <h4>Due Date</h4>
            <input type="date" value={assignment?.dueDate}
                className="form-control mb-2" onChange={(e) => dispatch(selectAssignment({ ...assignment, dueDate: e.target.value }))} />


            <h4>Available From</h4>
            <input type="date" value={assignment?.availableFromDate}
                className="form-control mb-2" onChange={(e) => dispatch(selectAssignment({ ...assignment, availableFromDate: e.target.value }))} />


            <h4>Available Until</h4>
            <input type="date" value={assignment?.availableUntilDate}
                className="form-control mb-2" onChange={(e) => dispatch(selectAssignment({ ...assignment, availableUntilDate: e.target.value }))} />

            <button onClick={handleSave} className="btn btn-success ms-2 float-end">
                Save
            </button>
            <Link to={`/Kanbas/Courses/${courseId}/Assignments`}
                className="btn btn-danger float-end">
                Cancel
            </Link>
        </div>
    );
}
export default AssignmentEditor;