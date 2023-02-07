import React from 'react';
import StatusDot from './StatusDot';
import IFriendData, { EUserStatus } from './Types';
import { CollapseArrow } from '@/components/global/CollapseArrow';
import '@/style/details/social/FriendItem.css';
import Button from '@/components/global/Button';
import { Link } from 'react-router-dom';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';

interface IProps {
	friend: IFriendData;
}

interface IState {}

const linkStyle: React.CSSProperties = {
	textDecoration: 'none',
	fontSize: '1.3rem',
	letterSpacing: '0.03em',
	color: 'black',
};

class FriendItem extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
	}

	render() {
		console.log(this.props.friend.status);
		return (
			<li className="friend-item">
				<div className="friend-item-top">
					<img
						src={this.props.friend.profile.picture}
						draggable={false}
					/>
					<Link
						to={`/profile/${this.props.friend.name}`}
						style={linkStyle}
					>
						{this.props.friend.name}
					</Link>
				</div>
				<div className="friend-item-center">
					<StatusDot status={this.props.friend.status} />
				</div>
			</li>
		);
	}
}

export default FriendItem;
