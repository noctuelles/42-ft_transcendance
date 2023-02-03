import React from 'react';
import StatusDot from './StatusDot';
import IFriendData, { EUserStatus } from './Types';
import { CollapseArrow } from '@/components/global/CollapseArrow';
import '@/style/details/social/FriendItem.css';
import Button from '@/components/global/Button';

interface IProps {
	friend: IFriendData;
}

interface IState {}

class FriendItem extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
	}

	render() {
		return (
			<li className="friend-item">
				<div className="friend-item-top">
					<img
						src="https://cdn.iconscout.com/icon/free/png-512/friend-couple-gemini-hand-hold-man-twins-37761.png"
						width={50}
						height={50}
					/>
					<span id="friend-name">{this.props.friend.name}</span>
				</div>
				<div className="friend-item-center">
					<StatusDot status={EUserStatus.ONLINE} />
				</div>
				<div className="friend-item-bottom">
					<Button>Remove</Button>
					{this.props.friend.status == EUserStatus.ONLINE && (
						<Button>Invite</Button>
					)}
				</div>
			</li>
		);
	}
}

export default FriendItem;
