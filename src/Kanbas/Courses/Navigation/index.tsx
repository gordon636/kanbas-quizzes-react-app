import { Link, useLocation } from "react-router-dom";
import "./index.css"; // feel free to use the CSS from previous assignments

function CourseNavigation() {
    const links = ["Home", "Modules", "Piazza", "Grades", "Assignments", "Quizzes"];
    const placeholderLinks = ["People", "Panopto Video", "Discussions", "Accouncements", "Pages", "Files", "Rubrics", "Outcomes", "Collaborations", "Syllabus", "Settings"];

    const { pathname } = useLocation();
    return (
        <ul className="wd-navigation">
            {links.map((link, index) => (
                <li key={index} className={pathname.includes(link) ? "wd-active" : ""}>
                    <Link to={link}>{link}</Link>
                </li>
            ))}
            {placeholderLinks.map((link, index) => (
                <li key={index} className={pathname.includes(link) ? "wd-active" : ""}>
                    <Link to="#">{link}</Link>
                </li>
            ))}
        </ul>
    );
}
export default CourseNavigation;