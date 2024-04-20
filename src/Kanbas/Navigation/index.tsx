import { Link, useLocation } from "react-router-dom";
import "./index.css";
import {
    FaTachometerAlt,
    FaRegUserCircle,
    FaBook,
    FaRegCalendarAlt,
    FaInbox,
    FaQuestionCircle,
    FaArrowAltCircleRight,
    FaYoutubeSquare,
    FaClock
} from "react-icons/fa";

function KanbasNavigation() {
    const links = [
        { label: "Account", icon: <FaRegUserCircle className="fs-2" /> },
        { label: "Dashboard", icon: <FaTachometerAlt className="fs-2" /> },
        { label: "Courses", icon: <FaBook className="fs-2" /> },
        { label: "Calendar", icon: <FaRegCalendarAlt className="fs-2" /> },
    ];
    const placeholderLinks = [
        { label: "Inbox", icon: <FaInbox className="fs-2" /> },
        { label: "History", icon: <FaClock className="fs-2" /> },
        { label: "Studio", icon: <FaYoutubeSquare className="fs-2" /> },
        { label: "Commons", icon: <FaArrowAltCircleRight className="fs-2" /> },
        { label: "Help", icon: <FaQuestionCircle className="fs-2" /> }
    ]

    const { pathname } = useLocation();
    return (
        <ul className="wd-kanbas-navigation" style={{ height: "100%" }}>
            <li style={{ fontSize: "30px", fontWeight: "bold", color: "red" }}>N</li>
            {links.map((link, index) => (
                <li key={index} className={pathname.includes(link.label) ? "wd-active" : ""} id={link.label === "Account" ? "account-tab" : ""}>
                    <Link to={`/Kanbas/${link.label}`}> {link.icon} <br /> {link.label} </Link>
                </li>
            ))}
            {placeholderLinks.map((link, index) => (
                <li key={index} className={pathname.includes(link.label) ? "wd-active" : ""}>
                    <Link to={`#`}> {link.icon} <br /> {link.label} </Link>
                </li>
            ))}
        </ul>
    );
}
export default KanbasNavigation;