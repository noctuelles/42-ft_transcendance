import { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '@/context/UserContext';
import checkIcon from '@/assets/check-mark.svg';
import '@/style/auth/UserCreation.css';
import ImageLoad from 'image-preview-react';
import { back_url } from '@/config.json';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';
import { InfoBoxContext, InfoType } from '@/context/InfoBoxContext';

function UserCreation() {
	const userContext = useContext(UserContext);
	const imgRef = useRef<any>();
	const btnRef = useRef<any>();
	const [error, setError] = useState('');
	const navigate = useNavigate();
	const infoBoxContext = useContext(InfoBoxContext);

	useEffect(() => {
		ImageLoad({ button: btnRef, image: imgRef });
		fetch(back_url + `/auth/name/${userContext.auth.creatingUser.name}`)
			.then((res) => {
				if (res.ok) return res.json();
				throw new Error('Impossible to verify username');
			})
			.then((data) => {
				if (data.valid) setError('');
				else setError(data.reason);
			})
			.catch((err) => {
				infoBoxContext.addInfo({
					type: InfoType.ERROR,
					message: err.message,
				});
			});
	});

	function updateName(e: any) {
		if (e.targe.value && e.target.value.length > 0) {
			userContext.auth.changeName(e.target.value);
			fetch(back_url + `/auth/name/${e.target.value}`)
				.then((res) => {
					if (res.ok) return res.json();
					throw new Error('Impossible to update name');
				})
				.then((data) => {
					if (data.valid) setError('');
					else setError(data.reason);
				})
				.catch((err) => {
					infoBoxContext.addInfo({
						type: InfoType.ERROR,
						message: err.message,
					});
				});
		}
	}

	async function submit(e: any) {
		e.preventDefault();
		if (error != '') return;
		let formData = new FormData();
		formData.append('login', userContext.auth.creatingUser.login);
		formData.append('name', userContext.auth.creatingUser.name);
		if (btnRef.current.files.length > 0) {
			formData.append('profile_picture', btnRef.current.files[0]);
		}
		fetch(back_url + '/auth/create', {
			method: 'POST',
			body: formData,
		})
			.then((res) => {
				if (res.ok) return res.json();
				throw new Error('Impossible to create user');
			})
			.then(async (data) => {
				if (data.state == 'connected') {
					userContext.auth.setLogged(true);
					userContext.auth.setAccessToken(
						data.tokens.access_token.token,
					);
					Cookies.set(
						'transcendance_session_cookie',
						data.tokens.refresh_token.token,
						{
							expires: 7 * 24 * 60 * 60,
						},
					);
					userContext.auth.setUpdating(false);
					await userContext.updateUser();
					navigate('/');
				}
			})
			.catch((err) => {
				infoBoxContext.addInfo({
					type: InfoType.ERROR,
					message: err.message,
				});
			});
	}

	return (
		<div className="user-creation">
			<h1 className="user-creation-title">
				Subject preparation for experiment
			</h1>
			<form className="user-creation-form">
				<div className="user-creation-form-sec1">
					<label className="user-creation-form-name-label user-creation-form-label">
						Name
					</label>
					<input
						type="text"
						value={userContext.auth.creatingUser.name}
						className="user-creation-form-name-input"
						onChange={updateName}
					/>
				</div>
				<div className="user-creation-form-sec2">
					<div className="user-creation-form-left">
						<label className="user-creation-form-photo-label user-creation-form-label">
							Photo
						</label>
						<img
							src={userContext.auth.creatingUser.profile_picture}
							alt="profile picture"
							className="user-creation-form-image-preview"
							ref={imgRef}
						/>
						<input
							id="file"
							name="file"
							type="file"
							accept="image/jpeg"
							className="user-creation-form-image-input"
							ref={btnRef}
						/>
						<label
							htmlFor="file"
							className="user-creation-file-label"
						>
							Select a file
						</label>
					</div>
					<div className="user-creation-form-right">
						<button
							type="submit"
							onClick={submit}
							className={
								'user-creation-form-btn ' +
								(error != '' ? 'btn-not-ready' : 'btn-ready')
							}
						>
							<img
								src={checkIcon.toString()}
								alt="validate"
								className="user-creation-form-check"
							/>
						</button>
						{error != '' && (
							<p className="user-creation-form-error">{error}</p>
						)}
					</div>
				</div>
			</form>
		</div>
	);
}

export default UserCreation;
