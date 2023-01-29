import Loader from '@/components/global/Loader';
import '@/style/auth/TwoFa.css';
import { useContext, useState } from 'react';
import TwoFaInput from './TwoFaInput';
import { back_url } from '@/config.json';
import Cookies from 'js-cookie';
import { UserContext } from '@/context/UserContext';
import { useNavigate } from 'react-router';
import { InfoBoxContext, InfoType } from '@/context/InfoBoxContext';

function TwoFaLog() {
	const [code, setCode] = useState([-1, -1, -1, -1, -1, -1]);
	const [finished, setFinished] = useState(false);
	const [error, setError] = useState('|');
	const [reset, setReset] = useState(false);
	const userContext = useContext(UserContext);
	const infoBoxContext = useContext(InfoBoxContext);
	const navigate = useNavigate();

	function testCode() {
		const codeString = code.join('');
		fetch(back_url + '/auth/2fa/connect', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				token: Cookies.get('transcendance_2fa_cookie'),
				code: codeString,
			}),
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error('Error');
				}
				return res.json();
			})
			.then((data) => {
				if (data.state === 'connected') {
					userContext.auth.setLogged(true);
					userContext.auth.setAccessToken(
						data.tokens.access_token.token,
					);
					Cookies.remove('transcendance_2fa_cookie');
					Cookies.set(
						'transcendance_session_cookie',
						data.tokens.refresh_token.token,
						{
							expires: 7 * 24 * 60 * 60,
						},
					);
					userContext.auth.setUpdating(false);
					userContext.updateUser();
					navigate('/', { replace: true });
				} else if (data.state === 'error') {
					setCode([-1, -1, -1, -1, -1, -1]);
					setFinished(false);
					setReset(true);
					setError('Invalid code, please rerty');
				}
			});
	}

	function changeCode(number: number, position: number) {
		if (!Cookies.get('transcendance_2fa_cookie')) {
			infoBoxContext.addInfo({
				type: InfoType.ERROR,
				message:
					'You take too long to enter your code. Please try again',
			});
			navigate('/login', { replace: true });
		}
		setReset(false);
		setError('|');
		setCode((prev: any) => {
			prev[position] = number;
			return prev;
		});
		if (position == 5) {
			setFinished(true);
			testCode();
		}
	}

	return (
		<div className="twofa">
			<h1>Please open your 2FA application and enter your code</h1>
			<TwoFaInput
				code={code}
				changeCode={changeCode}
				available={!finished}
				reset={reset}
			/>
			<Loader color={finished ? 'black' : 'transparent'} />
			<p style={{ color: error === '|' ? 'transparent' : 'black' }}>
				{error}
			</p>
		</div>
	);
}

export default TwoFaLog;
