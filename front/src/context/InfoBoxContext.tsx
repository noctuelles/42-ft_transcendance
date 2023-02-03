import React, { useRef, useState } from 'react';

export enum InfoType {
	ERROR = 'error',
	WARNING = 'warning',
	SUCCESS = 'success',
}

export interface IInfo {
	id: string;
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
	removeInfo: (id: string) => void;
	enableInfoBox: () => void;
	disableInfoBox: () => void;
}

export const InfoBoxContext = React.createContext<IInfoBoxContext>(
	{} as IInfoBoxContext,
);

function InfoBoxContextProvider(props: any) {
	const [infos, setInfos] = useState<IInfo[]>([]);
	const enable = useRef(true);

	function enableInfoBox() {
		enable.current = true;
	}

	function disableInfoBox() {
		enable.current = false;
	}

	async function removeInfo(id: string) {
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
		const id = crypto.randomUUID();
		setInfos((inf: IInfo[]) => {
			if (inf.length >= 5) {
				inf = inf.slice(1, inf.length);
			}
			return [
				...inf,
				{
					...info,
					id: id,
					visible: true,
					onClick: info.onClick,
				},
			];
		});
		setTimeout(() => {
			removeInfo(id);
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
