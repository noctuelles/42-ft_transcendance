import React from 'react';
import FriendItem from './FriendItem';
import IFriendData from './Types';
import '@/style/details/social/FriendList.css';

interface IProps {}

interface IState {
	friendSearchName: string;
	friends: IFriendData[];
}

class FriendList extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			friendSearchName: '',
			friends: [],
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount(): void {
		fetch('https://63dce19f367aa5a7a403e78b.mockapi.io/users')
			.then((response) => {
				if (response.ok) return response.json();
				return Promise.reject(response);
			})
			.then((data: IFriendData[]) => {
				this.setState({ ...this.state, friends: data });
				console.log(data);
			});
	}

	handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
		e.preventDefault();

		const requestOptions: RequestInit = {
			method: 'POST',
			headers: { 'Content-Type': 'text' },
			body: JSON.stringify({ user: this.state.friendSearchName }),
		};

		console.log(requestOptions);
	}

	handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		this.setState({ ...this.state, friendSearchName: e.target.value });
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

				<ul>
					{this.state.friends.map((friend) => (
						<FriendItem key={friend.id} friend={friend} />
					))}
				</ul>
			</div>
		);
	}
}

export default FriendList;
