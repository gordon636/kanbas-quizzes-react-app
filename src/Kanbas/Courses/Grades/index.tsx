import { FaChevronDown, FaCog, FaFileExport, FaFileImport, FaFilter, FaKeyboard, FaSearch } from "react-icons/fa";
import { db } from "../../Database";
import { useParams } from "react-router-dom";
function Grades() {
    const { courseId } = useParams();
    const as = db.assignments.filter((assignment) => assignment.course === courseId);
    const es = db.enrollments.filter((enrollment) => enrollment.course === courseId);
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex justify-content-between align-items-center" style={{ color: "red", width: "48%" }}>
                    <span className="d-flex justify-content-start">Gradebook <FaChevronDown /></span>
                    <span className="d-flex justify-content-end"><FaKeyboard /></span>
                </div>
                <div className="d-flex justify-content-between align-items-center gap-2 mb-3 p-3" style={{ float: "right" }}>
                    <div className="d-flex justify-content-end align-items-center">
                        <button type="button" className="btn btn-light btn-sm rounded pl-0 ps-3 pe-3 border">
                            <FaFileImport /> Import
                        </button>
                        <button type="button" className="btn btn-light btn-sm rounded pl-0 ps-3 pe-3 border">
                            <FaFileExport /> Export <FaChevronDown />
                        </button>
                    </div>
                    <div className="d-flex justify-content-end align-items-center">
                        <button type="button" className="btn btn-light btn-sm rounded pl-0 ps-3 pe-3 border">
                            <FaCog />
                        </button>
                    </div>
                </div>
            </div>



            <div className="table-responsive">
                <div className="row mb-3">
                    <div className="col-md-6">
                        <b>Student Names</b>
                        <div className="input-group mb-3">
                            <span className="input-group-text">
                                <FaSearch />
                            </span>
                            <input type="text" className="form-control" placeholder="Search Students" />
                            <span className="input-group-text">
                                <FaChevronDown />
                            </span>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <b>Assignment Names</b>
                        <div className="input-group mb-3">
                            <span className="input-group-text">
                                <FaSearch />
                            </span>
                            <input type="text" className="form-control" placeholder="Search Assignments" />
                            <span className="input-group-text">
                                <FaChevronDown />
                            </span>
                        </div>
                    </div>
                </div>
                <div className="pb-3">
                    <button type="button" className="btn btn-light btn-sm rounded pl-0 ps-3 pe-3 border">
                        <FaFilter /> Apply Filters
                    </button>
                </div>

                <table className="table table-striped border">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            {as.map((assignment) => (
                                <th key={assignment._id} className="text-center" style={{ fontWeight: "normal" }}>{assignment.title}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {es.map((enrollment) => {
                            const user = db.users.find((user) => user._id === enrollment.user);
                            return (
                                <tr key={enrollment.user}>
                                    <td>{user?.firstName} {user?.lastName}</td>
                                    {as.map((assignment) => {
                                        const grade = db.grades.find(
                                            (grade) => grade.student === enrollment.user && grade.assignment === assignment._id
                                        );
                                        return (
                                            <td key={assignment._id} className="border text-center">
                                                {grade?.grade + "%" || ""}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

            </div>
        </div >
    );
}
export default Grades;