import '@/style/global/SideBar.css';
import { useState } from 'react';
import UserList, { UserListType } from '../pages/details/social/UsersList';
import Button from './Button';

const SideBar = () => {
	const [isExpand, setIsExpand] = useState<boolean>(false);
	const [showFriends, setShowFriends] = useState<boolean>(false);

	return (
		<>
			{isExpand && (
				<div className="social-sidebar">
					<div className="sidebar-top">
						<Button
							onClick={() =>
								showFriends
									? setShowFriends(false)
									: setShowFriends(true)
							}
						>
							{showFriends
								? 'Switch to blocked user'
								: 'Switch to friend list'}
						</Button>
					</div>
					{showFriends ? (
						<UserList
							type={UserListType.FRIEND}
							addEndpoint="/users/friends/add"
							removeEndpoint="/users/friends/remove"
							getEndpoint="/users/friends"
							placeholder="Your future friend..."
							hint="Having friend is an healthy habit !"
						/>
					) : (
						<UserList
							type={UserListType.BLOCKED}
							addEndpoint="/users/blocked/add"
							removeEndpoint="/users/blocked/remove"
							getEndpoint="/users/blocked"
							placeholder="User you want to block..."
							hint="You can't be friend with everybody !"
						/>
					)}
				</div>
			)}
			<div className={`side-bar ${isExpand ? 'expanded' : ''}`}>
				<i>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 640 512"
						className="friend-icon"
					>
						<path d="M352 128c0 70.7-57.3 128-128 128s-128-57.3-128-128S153.3 0 224 0s128 57.3 128 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM609.3 512H471.4c5.4-9.4 8.6-20.3 8.6-32v-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2h61.4C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z" />
					</svg>
				</i>
				<span>Social</span>
				<button
					className="expand-side-bar"
					onClick={() =>
						isExpand ? setIsExpand(false) : setIsExpand(true)
					}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 448 512"
						className={`chevron-icon ${
							isExpand ? 'collapse' : 'expand'
						}`}
					>
						<path d="M246.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-160-160c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L224 402.7 361.4 265.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-160 160zm160-352l-160 160c-12.5 12.5-32.8 12.5-45.3 0l-160-160c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L224 210.7 361.4 73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3z" />
					</svg>
				</button>
			</div>
		</>
	);
};

export default SideBar;
