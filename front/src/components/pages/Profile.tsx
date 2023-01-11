import React from "react";
import ProfileInfo from './details/ProfileInfo'
import {Container, Row, Col} from 'react-bootstrap'

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
			<p>{this.state.username}</p>
		);
	}
}

export default Profile;
