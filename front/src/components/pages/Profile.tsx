import React from "react";
import '../../style/Profile.css'
import {UserContext} from '../../context/UserContext';

class Profile extends React.Component<{}, {
		photo: any,
		username: string,
		victory: number,
		matches: number 
	}> {
	constructor(props: any) {
		super(props);


		this.state = {
			photo: null,
			username: "plouvel",
			victory: 2,
			matches: 42
		};
	}

	render() {
		return (
			<div className="container">
				<div className="top-header">
					<p>{this.state.username}</p>
					<div className="search">
						<input type="text" placeholder="Search a profile..."/>
						<button type="submit">bonjour</button>
					</div>
					<img src="https://cdn.intra.42.fr/users/1022f4b45a249d0c6cea0572d68baab8/plouvel.jpg"/>
				</div>
				<hr></hr>
				<p>Lorem ipsum</p>
			</div>
		);
	}
}

export default Profile;
