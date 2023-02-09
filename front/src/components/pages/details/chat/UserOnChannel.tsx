import IUser from './IUser';

export default function UserOnChannel({ user }: { user: IUser }) {
	return (
		<div>
			{user.status + ' ' + user.name + ' '}
			<img
				alt="profile picture"
				src={user.profile.picture}
				width="30vw"
			/>
		</div>
	);
}
