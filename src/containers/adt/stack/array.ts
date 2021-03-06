import React from 'react';
import {
	ArrowViewModel,
	Dimension,
	ElementViewModel,
	HistoryStep,
	NodeViewModel,
	Point,
	ViewModel
} from 'src/services/interface';
import { getById } from 'src/utils/animation';
import { ArrowType, Direction, FieldType, Position } from 'src/services/constants';
import { View } from 'src/containers/view';
import { Stack } from 'src/abstract-data-types/stack/array';
import { SubsequentNodeFactory, SubsequentNodeFactoryConfig } from 'src/services/node-factory';
import { calculateArrowMatrix, calculateCursorCoords, getDirectionByPosition } from 'src/utils/positioning';
import { AnimationBuildOptions } from 'src/utils/utils.interface';
import { HashMap } from 'react-move';

let idCounter: number = 1;

const nodeFactoryConfig: SubsequentNodeFactoryConfig = {
	sequence: {
		position: Position.right
	},
	node: {
		fields: {
			value: FieldType.value
		},
		direction: Direction.horizontal,
		offset: 0
	}
};

export class ArrayView<VType> extends View<Stack<VType>, VType> {

	protected Node = new SubsequentNodeFactory(nodeFactoryConfig);

	protected getInitialCoords(): Point {
		return {
			x: this.Node.width,
			y: this.props.dimension.height / 2
		}
	};

	constructor(props) {
		super(props);

		this.state = this.buildInitialViewModel();
		this.getElementViewModelById = this.getElementViewModelById.bind(this);
		this.mapToAnimateAttrs = this.mapToAnimateAttrs.bind(this);
	}

	public getAnimationBuildOptions(): AnimationBuildOptions {
		return {
			getElementViewModelById: this.getElementViewModelById,
			calculateByAttrs: this.mapToAnimateAttrs
		};
	}

	public getElementViewModelById(step: HistoryStep): ElementViewModel {
		return step.id === 'up'
			? this.state.arrows[0]
			: getById(this.state.nodes, step.id);
	}

	// TODO NEED REFACTORING! Currently it recalculates entire model every time.
	public buildViewModel(model: Stack<VType>): void {
		const { stack, up } = model as any;

		this.viewModel = this.getViewInitialState();
		const { nodes, arrows } = this.viewModel;
		const cursorVM = this.state.arrows[0];

		nodes[0] = this.buildNodeViewModel([stack[0], 0]);
		for (let i = 1; i < Stack.STACK_SIZE; i++) {
			nodes[i] = this.buildNodeViewModel([stack[i], i]);
		}
		arrows[0] = this.buildCursorViewModel(nodes[up], cursorVM && cursorVM.id);
	}

	protected buildNodeViewModel([ value, id ]: [VType, number]): NodeViewModel<VType> {
		return {
			id,
			ref: React.createRef(),
			value,
			coords: this.Node.getNodeCoords(id)
		};
	}

	protected buildCursorViewModel(nodeVM?: NodeViewModel<VType>,
                                 existedArrowId?: number | string): ArrowViewModel {
		const id = existedArrowId || `link${idCounter++}`;
		const [ outCoords, inCoords ] = calculateCursorCoords(
			this.Node,
			nodeVM ? nodeVM.id : -1
		);

		return {
			id,
			ref: React.createRef(),
			outCoords,
			inCoords,
			type: ArrowType.cursor
		};
	}

	protected buildInitialViewModel(): ViewModel<VType> {
		const initialValue = '' as any;
		const viewModel	= this.getViewInitialState();
		const { nodes, arrows } = viewModel;

		nodes[0] = this.buildNodeViewModel([initialValue, 0]);
		for (let i = 1; i < Stack.STACK_SIZE; i++) {
			nodes[i] = this.buildNodeViewModel([initialValue, i]);
		}
		arrows[0] = this.buildCursorViewModel(null, 'up');

		this.totalViewModel = viewModel;
		return this.buildResponsiveViewModel(viewModel);
	}

	private mapToAnimateAttrs(id: number | string, attrs: HashMap): HashMap {
		const { up, ...other } = attrs;
		if (up === undefined) {
			return attrs;
		}

		const [ outPoint, inPoint ] = calculateCursorCoords(this.Node, up);

		return {
			...other,
			transform: [`matrix(${calculateArrowMatrix(outPoint, inPoint).matrix})`]
		}
	}

	protected buildResponsiveViewModel(totalVM: ViewModel<VType>): ViewModel<VType> {
		const maxAmount = maxNodesAmount(this.props.dimension, this.Node);
		console.log(maxAmount);
		if (maxAmount <= totalVM.nodes.length) {
			return totalVM;
		}
		return totalVM;
	}
}

function maxNodesAmount(dimension: Dimension, Node: SubsequentNodeFactory): number {
	const isVertical = getDirectionByPosition(Node.sequencePosition) === Direction.vertical;
	const nodeLength = Node.offset + (isVertical ? Node.height : Node.width);

	return Math.floor((isVertical ? dimension.height : dimension.width) / nodeLength);
}
