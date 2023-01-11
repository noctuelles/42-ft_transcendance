import React from "react";
import '../../style/Profile.css'

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
			<div className="profilePage">
				<p>blabla</p>
			</div>
		);
	}
}

export default Profile;
