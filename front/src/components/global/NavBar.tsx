import React from 'react'
import { Link }from 'react-router-dom'
import '../../style/NavBar.css'
import Logo from '../../assets/navbrand.png'
import {UserContext} from '../../context/UserContext';

function NavBar(props: any) {
	const userContext = React.useContext(UserContext);

  return (
		<nav className="navBar">
			<Link to="">
				<img src={Logo} id="logo" />
			</Link>
			<h4>Le Pong</h4>
			<ul className="navLinks">
				<li className="navItem"><Link to="/">Home</Link></li>
				<li className="navItem"><Link to="/profile">Profile</Link></li>
			</ul>
			<div className="navRight">
				<img src={Logo}/>
				<p>{userContext.name}</p>
			</div>
		</nav>
  );
}

export default NavBar;
