import { Link } from 'react-router-dom';

function Header() {
    return (
        <div className="header">
            <Link to="page1" className="link">
                Page 1
            </Link>
            <Link to="page2" className="link">
                Page 2
            </Link>
            <Link to="chat" className="link">
                Chat
            </Link>
        </div>
    );
}

export default Header;
