import { useEffect, useState } from 'react';
import { back_url } from '../../config.json';
import '../../style/Login.css';
import portal from '../../assets/portal.svg';

function Login() {
	const [authUrl, setAuthUrl] = useState('');
	useEffect(() => {
		fetch(back_url + '/auth')
			.then((res) => {
				if (res.ok) return res.json();
				//TODO Error message
			})
			.then((data) => {
				setAuthUrl(data.url);
			});
	}, [setAuthUrl]);

	function redirectToAuth() {
		if (authUrl !== '') window.location.replace(authUrl);
	}

	return (
		<div className="login">
			<div className="login-main">
				<h1 className="login-title">APERTRANSCENDENCE</h1>
				<h2 className="login-subtitle">GAME</h2>
			</div>
			<svg
				className="login-portal"
				version="1.1"
				id="Layer_7"
				x="0px"
				y="0px"
				width="64px"
				height="64px"
				viewBox="0 0 64 64"
			>
				<g>
					<g>
						<path
							onClick={redirectToAuth}
							d="M38.772,3.061c-2.183-0.146-4.421,0.354-6.448,1.426
			c-5.897,3.117-9.298,9.234-12.095,15.009c1.301-3.668,1.301-4.312,4.504-10.253c-7.839,9.244-11.66,21.842-10.228,33.883
			c0.612,5.148,2.432,10.277,6.101,14.049c0.109,0.112,0.219,0.222,0.331,0.331c2.722,2.651,6.574,4.032,10.351,3.289
			c4.681-0.921,8.386-4.618,11.086-8.336c6.953-9.575,10.924-23.206,8.701-34.954c-0.86-4.549-2.773-9.384-6.556-12.287
			C42.794,3.896,40.807,3.197,38.772,3.061z M46.754,31.756c-0.424,4.081-1.965,9.169-2.947,11.051
			c-0.982,1.883-2.374,4.748-3.684,6.467c-1.947,2.555-5.637,5.443-9.039,4.911c-2.649-0.414-4.712-2.428-6.11-4.598
			c-1.006-1.563-2.436-4.136-2.452-6.043c0.057,6.975,4.463,14.43,12.279,13.179c0,0-1.228,1.392-3.029,1.555
			c-1.801,0.164-4.584-0.409-6.14-1.555c-1.555-1.146-4.502-4.339-5.403-9.25s-0.538-11.065,0.034-14.533
			c0.546-3.312,2.258-10.271,3.895-13.218c1.637-2.947,4.248-6.969,6.222-8.677c3.577-3.097,5.306-3.043,7.04-3.029
			c1.74,0.014,4.498,1.77,5.726,5.045c2.06,5.495,2.684,12.167,0.803,17.802c1.715-4.31,2.255-8.328,1.984-12.942
			c-0.082-1.392-0.246-2.62-0.246-2.62s1.284,3.194,1.474,6.303C47.352,24.71,47.025,29.139,46.754,31.756z"
						/>
					</g>
				</g>
				<path
					onClick={redirectToAuth}
					d="M51.075,17.506c-0.86-4.549-2.773-9.384-6.556-12.287c-1.725-1.323-3.712-2.022-5.747-2.159
	c-0.248-0.017-0.498-0.025-0.747-0.025c-1.942,0-3.904,0.501-5.701,1.451c-5.897,3.117-9.298,9.234-12.095,15.009
	c1.301-3.668,1.301-4.312,4.504-10.253c-7.839,9.244-11.66,21.842-10.228,33.883c0.612,5.148,2.432,10.277,6.101,14.049
	c0.109,0.112,0.219,0.222,0.331,0.331c2.228,2.17,5.213,3.489,8.294,3.489c0.683,0,1.371-0.065,2.057-0.2
	c4.681-0.921,8.386-4.618,11.086-8.336C49.326,42.886,53.297,29.255,51.075,17.506z M16.49,42.89
	c-0.511-4.302-0.315-8.695,0.528-12.972c0.339-1.72,1.179-3.614,1.834-5.243c0.774-1.925,2.848-4.444,2.848-4.444
	c-1.566,3.678-2.95,9.602-3.409,12.384c-0.664,4.028-0.931,10.295-0.028,15.219c0.495,2.701,1.573,5.029,2.815,6.868
	C18.026,50.958,16.894,46.289,16.49,42.89z M46.754,31.756c-0.424,4.081-1.965,9.169-2.947,11.051
	c-0.982,1.883-2.374,4.748-3.684,6.467c-1.788,2.347-5.048,4.975-8.203,4.975c-0.28,0-0.559-0.021-0.836-0.064
	c-2.648-0.414-4.712-2.428-6.11-4.598c-1.006-1.563-2.436-4.136-2.452-6.043c0.052,6.453,3.829,13.318,10.583,13.318
	c0.546,0,1.111-0.045,1.696-0.138c0,0-1.228,1.392-3.029,1.555c-0.203,0.018-0.418,0.028-0.642,0.028
	c-1.77,0-4.117-0.566-5.498-1.583c-1.555-1.146-4.502-4.339-5.403-9.25c-0.901-4.912-0.538-11.065,0.034-14.533
	c0.546-3.312,2.258-10.271,3.895-13.218c1.637-2.947,4.248-6.969,6.222-8.677c3.289-2.848,5.015-3.031,6.62-3.031
	c0.141,0,0.28,0.001,0.42,0.003c1.74,0.014,4.498,1.77,5.726,5.045c2.06,5.495,2.684,12.167,0.803,17.802
	c1.715-4.31,2.255-8.328,1.984-12.942c-0.082-1.392-0.246-2.62-0.246-2.62s1.068,3.127,1.257,6.237
	C47.135,24.643,47.025,29.139,46.754,31.756z M48.184,35.471c0.247-1.198,0.444-2.395,0.559-3.508
	c0.156-1.502,0.647-6.696,0.416-10.479c-0.102-1.679-0.484-3.355-0.851-4.64c-0.136-0.443-0.289-0.897-0.466-1.354
	c-1.396-3.605-3.526-5.742-5.051-6.968l0.006,0.041c-0.083-0.089-0.169-0.162-0.254-0.238c-0.298-0.231-0.565-0.424-0.795-0.586
	c-0.142-0.093-0.286-0.187-0.431-0.291c-1.307-0.934-2.701-1.423-3.88-1.433l-0.065-0.001l-0.371-0.002
	c-1.955,0-4.178,0.272-7.929,3.519c-0.414,0.358-0.837,0.786-1.258,1.258c1.538-1.83,3.321-3.413,5.444-4.536
	c1.509-0.798,3.158-1.219,4.767-1.219c0.205,0,0.41,0.007,0.614,0.02c1.311,0.088,2.562,0.472,3.681,1.108l0.009-0.008
	c0.029,0.017,0.059,0.04,0.088,0.058c0.015,0.009,0.032,0.015,0.047,0.024l0.001,0.008c1.07,0.664,2.212,1.602,3.192,2.894
	c0.104,0.137,0.236,0.369,0.382,0.653c1.71,2.565,2.607,5.627,3.071,8.084C50.142,23.332,49.765,29.469,48.184,35.471z"
				/>
			</svg>
			<p className="login-explain">
				Click on the portal to connect with you 42 account
			</p>
		</div>
	);
}

export default Login;
