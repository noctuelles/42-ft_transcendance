import React from 'react';

class FriendList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			friendSearchName: '',
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount(): void {}

	handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
		e.preventDefault();
	}

	handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		this.setState({ friendSearchName: e.target.value });
	}

	render() {
		return (
			<div className="friend-section">
				<h3>Friends</h3>
				<form onSubmit={this.handleSubmit}>
					<label htmlFor="friend-name">Add a friend</label>
					<input
						type="text"
						name="friend-name"
						id="friend-name"
						onChange={this.handleChange}
						placeholder="Friend name..."
						maxLength={21}
					/>
					<button type="submit">Add</button>
				</form>
			</div>
		);
	}
}

export default FriendList;
