import React, { useRef, useState } from 'react';

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
	onClick?: (event?: any) => void;
}

export interface IInfoBuilder {
	type: InfoType;
	message: string;
	onClick?: (event?: any) => void;
}

interface IInfoBoxContext {
	infos: IInfo[];
	addInfo: (info: IInfoBuilder) => void;
	removeInfo: (id: number) => void;
	enableInfoBox: () => void;
	disableInfoBox: () => void;
}

export const InfoBoxContext = React.createContext<IInfoBoxContext>(
	{} as IInfoBoxContext,
);

function InfoBoxContextProvider(props: any) {
	const [infos, setInfos] = useState<IInfo[]>([]);
	const [id, setId] = useState(0);
	const enable = useRef(true);

	function enableInfoBox() {
		enable.current = true;
	}

	function disableInfoBox() {
		enable.current = false;
	}

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
		if (!enable.current) return;
		let inf = [...infos];
		console.log('before', inf.length);
		if (inf.length >= 5) {
			inf = inf.slice(1, inf.length);
		}
		console.log('after', inf.length);
		setInfos([
			...inf,
			{ ...info, id: id, visible: true, onClick: info.onClick },
		]);
		const save = id;
		setId((id) => id + 1);
		setTimeout(() => {
			removeInfo(save);
		}, 5000);
	}
	return (
		<InfoBoxContext.Provider
			value={{
				infos,
				addInfo,
				removeInfo,
				enableInfoBox,
				disableInfoBox,
			}}
		>
			{props.children}
		</InfoBoxContext.Provider>
	);
}

export default InfoBoxContextProvider;
