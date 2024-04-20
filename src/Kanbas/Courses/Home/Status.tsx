import { FaBell, FaChartBar, FaFileImport, FaLifeRing, FaVolumeUp } from "react-icons/fa";

function Status() {
    return (
        <div>
            <div className="row flex-grow-0 me-2 d-none d-lg-block" style={{ width: "250px" }}>
                <div>
                    <ul className="list-group">
                        <li className="list-group-item mb-2 bg-light border rounded"><FaFileImport /> Import
                            Existing Content</li>
                        <li className="list-group-item mb-2 bg-light border rounded"><FaFileImport /> Import
                            From Commons</li>
                        <li className="list-group-item mb-2 bg-light border rounded"><FaLifeRing /> Choose
                            Home Page</li>
                        <li className="list-group-item mb-2 bg-light border rounded"><FaChartBar /> View
                            Course Stream</li>
                        <li className="list-group-item mb-2 bg-light border rounded"><FaVolumeUp /> New
                            Announcement</li>
                        <li className="list-group-item mb-2 bg-light border rounded"><FaChartBar /> New
                            Analytics</li>
                        <li className="list-group-item mb-2 bg-light border rounded"><FaBell /> View Course
                            Notifications</li>
                    </ul>
                </div>

                <div>
                    <p><b>To Do</b></p>
                    <hr className="mb-0" />

                    <div className="row">
                        <div className="col-12 d-flex align-items-start p-3">
                            <span className="badge bg-danger rounded-circle">5</span>
                            <div className="ms-3 flex-grow-1">
                                <span className="text-danger">Grade A1 - ENV + HTML</span>
                                <p className="text-secondary small mb-2">100 points &bull; Sep 18 at 11:59pm</p>
                            </div>
                            <button type="button" className="btn-close btn-close-sm" aria-label="Close"></button>
                        </div>
                        <div className="col-12 d-flex align-items-start p-3">
                            <span className="badge bg-danger rounded-circle">5</span>
                            <div className="ms-3 flex-grow-1">
                                <span className="text-danger">Grade A2 - CSS + BOOTSTRAP</span>
                                <p className="text-secondary small mb-2">100 points &bull; Oct 2 at 11:59pm</p>
                            </div>
                            <button type="button" className="btn-close btn-close-sm" aria-label="Close"></button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
export default Status;