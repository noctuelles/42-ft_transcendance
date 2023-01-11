import React from 'react'
import { Link }from 'react-router-dom'
import '../../style/NavBar.css'
import Logo from '../../assets/navbrand.png'
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
				<img src={Logo}/>
				<Link to="/profile">{userContext.name}</Link>
			</div>
		</nav>
  );
}

export default NavBar;
