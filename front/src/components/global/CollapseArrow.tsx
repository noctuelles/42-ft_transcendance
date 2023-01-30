import React, { useState } from 'react';
import '@/style/global/CollapseArrow.css';

interface CollapseArrowProps {
	children?: React.ReactNode;
}

export function CollapseArrow({ children }: CollapseArrowProps) {
	const [collapse, setCollapse] = useState(true);

	function handleArrowClick() {
		collapse ? setCollapse(false) : setCollapse(true);
	}

	return (
		<>
			{!collapse ? children : null}
			<div
				className={`arrow ${collapse ? 'up' : 'down'}`}
				onClick={handleArrowClick}
			/>
		</>
	);
}
