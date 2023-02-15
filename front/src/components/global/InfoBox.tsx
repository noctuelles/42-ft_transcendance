import { CSSTransition } from 'react-transition-group';
import { IInfo, InfoBoxContext } from '@/context/InfoBoxContext';
import '@/style/InfoBox.css';
import crossIcon from '@/assets/cross.svg';

import { useContext, useRef } from 'react';

interface IInfoProps {
	info: IInfo;
	infoBoxContext: any;
}

function Info(props: IInfoProps) {
	const nodeRef = useRef(null);
	return (
		<CSSTransition
			nodeRef={nodeRef}
			transistionname="info"
			timeout={200}
			in={props.info.visible}
			appear={true}
			classNames={{
				appear: 'appear',
				appearActive: 'appear-active',
				exit: 'exit',
				exitActive: 'exit-active',
			}}
		>
			<div
				ref={nodeRef}
				className={`info-item info-item-${props.info.type} ${
					props.info.onClick && 'info-item-clickable'
				}`}
				onClick={props.info.onClick}
			>
				<img
					src={crossIcon.toString()}
					className="cross-icon"
					alt="cross icon"
					onClick={() =>
						props.infoBoxContext.removeInfo(props.info.id)
					}
				/>
				<p>{props.info.message}</p>
			</div>
		</CSSTransition>
	);
}

function InfoBox() {
	const infoBoxContext = useContext(InfoBoxContext);

	return (
		<div className="infos">
			{infoBoxContext.infos
				.slice(0)
				.reverse()
				.map((info: IInfo) => {
					return (
						<Info
							key={info.id}
							info={info}
							infoBoxContext={infoBoxContext}
						/>
					);
				})}
		</div>
	);
}

export default InfoBox;
