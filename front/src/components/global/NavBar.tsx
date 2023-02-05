import React from 'react';
import { Link } from 'react-router-dom';
import '@/style/NavBar.css';
import { UserContext } from '@/context/UserContext';

function NavBar(props: any) {
	const userContext = React.useContext(UserContext);

	return (
		<nav>
			<ul className="navLinks">
				<li className="navItem">
					<Link to="/">Play</Link>
				</li>
				<li className="navItem">
					<Link to="/social">Social</Link>
				</li>
				<li className="navItem">
					<Link to="/chat">Chat</Link>
				</li>
				<li className="navItem">
					<Link to="/settings">Settings</Link>
				</li>
			</ul>
			<div className="navRight">
				<img src={userContext.user.profile_picture} />
				<Link to={`/profile/${userContext.user.name}`}>
					{userContext.user.name}
				</Link>
				<button className="nav-logout" onClick={userContext.logout}>
					Logout
				</button>
			</div>
		</nav>
	);
}

export default NavBar;
