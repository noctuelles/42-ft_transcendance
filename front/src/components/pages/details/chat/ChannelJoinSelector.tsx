import { ChannelJoinType } from './ChannelJoinList';

interface IChannelJoinSelectorProps {
	joinType: ChannelJoinType;
	setJoinType: (type: ChannelJoinType) => void;
}

function ChannelJoinSelector(props: IChannelJoinSelectorProps) {
	return (
		<div className="channel-join-selector">
			<div
				className={`channel-join-selector-item channel-join-selector-${
					props.joinType == ChannelJoinType.PUBLIC
						? 'selected'
						: 'unselected'
				}`}
				onClick={() => props.setJoinType(ChannelJoinType.PUBLIC)}
			>
				{ChannelJoinType.PUBLIC}
			</div>
			<div
				className={`channel-join-selector-item channel-join-selector-${
					props.joinType == ChannelJoinType.PASSWORD_PROTECTED
						? 'selected'
						: 'unselected'
				}`}
				onClick={() =>
					props.setJoinType(ChannelJoinType.PASSWORD_PROTECTED)
				}
			>
				{ChannelJoinType.PASSWORD_PROTECTED}
			</div>
			<div
				className={`channel-join-selector-item channel-join-selector-${
					props.joinType == ChannelJoinType.INVITED
						? 'selected'
						: 'unselected'
				}`}
				onClick={() => props.setJoinType(ChannelJoinType.INVITED)}
			>
				{ChannelJoinType.INVITED}
			</div>
		</div>
	);
}

export default ChannelJoinSelector;
