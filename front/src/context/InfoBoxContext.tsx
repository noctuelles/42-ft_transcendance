import React, { useState } from 'react';

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
		setInfos((inf: IInfo[]) => {
			if (inf.length >= 5) {
				inf = inf.slice(1, inf.length);
			}
			return [...inf, { ...info, id: id, visible: true }];
		});
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
