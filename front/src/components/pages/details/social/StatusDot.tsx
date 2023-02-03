import React from 'react';
import { EUserStatus } from './Types';
import '@/style/details/social/StatusDot.css';

interface IProps {
	status: EUserStatus;
}

interface IState {}

const DotColor = new Map<EUserStatus, string>([
	[EUserStatus.ONLINE, 'rgb(0, 204, 0)'],
	[EUserStatus.PLAYING, 'rgb(255, 153, 0)'],
	[EUserStatus.OFFLINE, 'darkgrey'],
]);

export default class StatusDot extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
	}

	render() {
		return (
			<>
				<span
					className="status-dot"
					style={{ backgroundColor: DotColor.get(this.props.status) }}
				/>
				<span>
					{' '}
					{this.props.status.charAt(0) +
						this.props.status.slice(1).toLowerCase()}
				</span>
			</>
		);
	}
}
