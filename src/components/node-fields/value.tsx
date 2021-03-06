import React, { useRef } from 'react';
import {
	FieldHeight,
	FieldWidth,
	FieldType
} from 'src/services/constants';
import { calculateNodeMatrix } from 'src/utils/positioning';

export const ValueField = ({ children, attrs }) => {
	const fieldWidth = FieldWidth[FieldType.value];
	const matrix = useRef<number[]>(
		calculateNodeMatrix({ x: Number(attrs.x), y: Number(attrs.y) }),
	);

	return (
			<g
					className="node"
					transform={`matrix(${matrix.current})`}
			>
				<rect
						className="node__figure"
						height={FieldHeight}
						width={fieldWidth}
						fill={attrs.fill}
				/>
				<text
						className="node__caption"
						x={fieldWidth / 2}
						y={FieldHeight / 2}
				>
					{children}
				</text>
			</g>
	)
};
