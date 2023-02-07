import React, { useEffect, useState } from 'react';
import FriendItem from './FriendItem';
import IFriendData from './Types';
import TextField from '@/components/global/TextField';
import '@/style/details/social/FriendList.css';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';

interface IProps {}

interface IState {
	friendSearchName: string;
	friends: IFriendData[];
}

const FriendList = (props: IProps) => {
	const [friends, setFriends] = useState<IFriendData[] | null>(null);
	const validation = Yup.object().shape({
		userName: Yup.string().required('Requiered'),
	});
	const values = {
		userName: '',
	};

	useEffect(() => {
		fetch('https://63dce19f367aa5a7a403e78b.mockapi.io/users')
			.then((response) => {
				if (response.ok) return response.json();
				return Promise.reject(response);
			})
			.then((data: IFriendData[]) => {
				setFriends(data);
			});
	});

	return (
		<div className="friend-list">
			<h2>Add a friend</h2>
			<Formik
				validationSchema={validation}
				initialValues={values}
				onSubmit={() => {}}
			>
				<Form className="add-friend-form">
					<TextField
						label="Username"
						id="userName"
						name="userName"
						helpText="Having friends is cool !"
						type="text"
						placeholder="Friend name..."
					/>
					<button type="submit">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 640 512"
						>
							<path d="M352 128c0 70.7-57.3 128-128 128s-128-57.3-128-128S153.3 0 224 0s128 57.3 128 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
						</svg>
					</button>
				</Form>
			</Formik>
			<ul className="friend-ul">
				{friends?.map((friend) => (
					<FriendItem key={friend.id} friend={friend} />
				))}
			</ul>
		</div>
	);
};

export default FriendList;
