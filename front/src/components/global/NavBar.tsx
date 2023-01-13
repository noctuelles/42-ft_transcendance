import React from 'react'
import { Link }from 'react-router-dom'
import '../../style/NavBar.css'
import {UserContext} from '../../context/UserContext';

function NavBar(props: any) {
	const userContext = React.useContext(UserContext);

  return (
		<nav className="navBar">
			<ul className="navLinks">
				<li className="navItem"><Link to="/">Play</Link></li>
				<li className="navItem"><Link to="/social">Social</Link></li>
			</ul>
			<div className="navRight">
				<img src="wewe"/>
				<Link to="/profile">Lol</Link>
			</div>
		</nav>
  );
}

export default NavBar;
