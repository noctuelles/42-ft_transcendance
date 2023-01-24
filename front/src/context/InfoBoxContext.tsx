import React, { useState } from 'react';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import { ws_url as WS_URL } from '@/config.json';
import { useNavigate } from 'react-router';

export enum InfoType {
	ERROR = 'error',
	WARNING = 'warning',
	SUCCESS = 'success',
}

export interface IInfo {
	id: number;
	type: InfoType;
	message: string;
	visible: boolean;
}

export interface IInfoBuilder {
	type: InfoType;
	message: string;
}

export const InfoBoxContext = React.createContext({
	infos: [] as IInfo[],
	addInfo: (info: IInfoBuilder) => {},
	removeInfo: (id: number) => {},
});

function InfoBoxContextProvider(props: any) {
	const [infos, setInfos] = useState<IInfo[]>([]);
	const [id, setId] = useState(0);
	const navigate = useNavigate();

	function isGameAbortedEvent(data: any): boolean {
		return data.event === 'game-aborted';
	}

	useWebSocket(WS_URL, {
		share: true,
		onMessage: ({ data }) => {
			data = JSON.parse(data);
			if (isGameAbortedEvent(data)) {
				if (data.data.reason === 'player-left') {
					if (data.data.result === 'lose') {
						addInfo({
							type: InfoType.ERROR,
							message: 'You left the game and lost',
						});
					} else if (data.data.result === 'win') {
						addInfo({
							type: InfoType.SUCCESS,
							message: 'Your opponent left the game and you won',
						});
						navigate('/', { replace: true });
					}
				}
			}
		},
		filter: ({ data }) => {
			return isGameAbortedEvent(JSON.parse(data));
		},
	});

	async function removeInfo(id: number) {
		setInfos((infos) =>
			infos.map((info) => {
				if (info.id === id) {
					return { ...info, visible: false };
				}
				return info;
			}),
		);
		const save = id;
		setTimeout(() => {
			setInfos((infos) => infos.filter((info) => info.id !== save));
		}, 200);
	}

	async function addInfo(info: IInfoBuilder) {
		let inf = [...infos];
		if (inf.length >= 5) {
			inf = inf.slice(1, inf.length);
		}
		setInfos([...inf, { ...info, id: id, visible: true }]);
		const save = id;
		setId((id) => id + 1);
		setTimeout(() => {
			removeInfo(save);
		}, 5000);
	}
	return (
		<InfoBoxContext.Provider value={{ infos, addInfo, removeInfo }}>
			{props.children}
		</InfoBoxContext.Provider>
	);
}

export default InfoBoxContextProvider;
