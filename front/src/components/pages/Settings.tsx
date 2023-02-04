import '@/style/Settings.css';
import { useContext, useEffect, useState } from 'react';
import { back_url } from '@/config.json';
import { UserContext } from '@/context/UserContext';
import TwoFaInput from './auth/TwoFaInput';
import Loader from '../global/Loader';

function Settings() {
	const [finished, setFinished] = useState(false);
	const [reset, setReset] = useState(false);
	const [error, setError] = useState('|');
	const [qrcode, setQrcode] = useState('');
	const userContext = useContext(UserContext);

	useEffect(() => {
		async function fetchStatus() {
			const token = await userContext.getAccessToken();
			fetch(back_url + '/auth/2fa', {
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + token,
				},
			})
				.then((res) => {
					if (!res.ok) {
						throw new Error('Error');
					}
					return res.json();
				})
				.then((data) => {
					userContext.auth.setTwoFaStatus(data.enabled);
				});
		}
		if (userContext.auth.twoFaStatus === null) fetchStatus();
	}, []);

	async function disableTwoFa() {
		const token = await userContext.getAccessToken();
		fetch(back_url + '/auth/2fa/disable', {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + token,
			},
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error('Error');
				}
				return 'Success';
			})
			.then((_) => {
				userContext.auth.setTwoFaStatus(false);
			});
	}

	async function enableTwoFa() {
		const token = await userContext.getAccessToken();
		fetch(back_url + '/auth/2fa/enable', {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + token,
			},
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error('Error');
				}
				return res.text();
			})
			.then((data) => {
				setQrcode(data);
			});
	}

	async function verify2Fa(code: string) {
		setFinished(true);
		const token = await userContext.getAccessToken();
		fetch(back_url + '/auth/2fa/verify', {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ code: code }),
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error('Error');
				}
				return res.json();
			})
			.then((data) => {
				if (data.result === 'activated') {
					userContext.auth.setTwoFaStatus(true);
					setQrcode('');
					setFinished(false);
					setError('|');
					setReset(false);
				} else if (data.result === 'error') {
					setFinished(false);
					setReset(true);
					setError("The code you entered doesn't match");
				}
			});
	}

	function onChange() {
		setReset(false);
		setError('|');
	}

	return (
		<div className="settings">
			<h1>Settings</h1>
			{userContext.auth.twoFaStatus ? (
				<div className="set-twoFa">
					<h2>Two factor authentication</h2>
					<p>Two factor authentication is enabled.</p>
					<button onClick={disableTwoFa}>Disable</button>
				</div>
			) : (
				<div className="set-twoFa">
					<h2>Two factor authentication</h2>
					{!qrcode ? (
						<>
							<p>Two factor authentication is disabled.</p>
							<button onClick={enableTwoFa}>Enable</button>
						</>
					) : (
						<>
							<p>Please open your 2FA app and scan this code</p>
							<img src={qrcode} alt="qrcode" />
							<p>
								When it's done, please enter your code to
								verifiy the 2FA
							</p>
							<TwoFaInput
								enabled={!finished}
								callback={verify2Fa}
								reset={reset}
								onChange={onChange}
							/>
							<p
								style={{
									color:
										error === '|' ? 'transparent' : 'black',
								}}
							>
								{error}
							</p>
							<Loader
								color={finished ? 'black' : 'transparent'}
							/>
						</>
					)}
				</div>
			)}
		</div>
	);
}

export default Settings;
