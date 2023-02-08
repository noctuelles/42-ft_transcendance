import { useContext, useEffect, useState } from 'react';
import FriendItem from './FriendItem';
import IFriendData from './Types';
import TextField from '@/components/global/TextField';
import '@/style/details/social/FriendList.css';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { back_url } from '@/config.json';
import { UserContext } from '@/context/UserContext';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import { ws_url } from '@/config.json';
import { InfoBoxContext, InfoType } from '@/context/InfoBoxContext';

interface IValues {
	username: string;
}

const FriendList = () => {
	const userContext = useContext(UserContext);
	const infoContext = useContext(InfoBoxContext);
	const [friends, setFriends] = useState<IFriendData[] | null>(null);
	const validation = Yup.object().shape({
		username: Yup.string().required('Requiered'),
	});
	const values = {
		username: '',
	};

	useWebSocket(ws_url, {
		share: true,
		onMessage: (event) => {
			const content = JSON.parse(event.data);

			if (content.event === 'user-status') {
				let updatedList = friends?.map((friend) => {
					if (friend.id === content.data.id)
						friend.status = content.data.status;
					return friend;
				});

				if (updatedList) setFriends(updatedList);
			}
		},
	});

	useEffect(() => {
		async function fetchData() {
			const token = await userContext.getAccessToken();

			fetch(back_url + '/users/friends', {
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + token,
				},
			})
				.then((response) => {
					if (!response.ok) throw new Error();
					if (response.ok) return response.json();
				})
				.then((data: IFriendData[]) => {
					setFriends(data);
				})
				.catch(() => {
					infoContext.addInfo({
						type: InfoType.ERROR,
						message: `Cannot load friend list`,
					});
				});
		}
		fetchData();
	}, []);

	async function handleAddFriend(
		values: IValues,
		{
			setFieldError,
		}: { setFieldError: (field: string, errorMsg: string) => void },
	) {
		const token = await userContext.getAccessToken();

		fetch(back_url + '/users/friends/add', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
				Authorization: 'Bearer ' + token,
			},
			body: JSON.stringify(values),
		})
			.then((response) => {
				if (!response.ok)
					return response.text().then((text) => {
						throw new Error(text);
					});
				if (response.ok) return response.json();
			})
			.then((response) => {
				setFriends(response);
			})
			.catch((err) => {
				const errObj = JSON.parse(err.message);
				setFieldError('username', errObj.message);
			});
	}

	return (
		<div className="friend-list">
			<h2>Add a friend</h2>
			<Formik
				validationSchema={validation}
				initialValues={values}
				onSubmit={handleAddFriend}
			>
				<Form className="add-friend-form">
					<TextField
						label="Username"
						id="username"
						name="username"
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
			{friends ? (
				<ul className="friend-ul">
					{friends.length !== 0 ? (
						friends.map((friend) => (
							<FriendItem
								key={friend.id}
								friend={friend}
								setFriends={setFriends}
							/>
						))
					) : (
						<li style={{ textAlign: 'center', fontSize: '1.2rem' }}>
							You don't have any friends.
						</li>
					)}
				</ul>
			) : (
				<h3 style={{ textAlign: 'center', fontSize: '1.2rem' }}>
					Loading...
				</h3>
			)}
		</div>
	);
};

export default FriendList;
