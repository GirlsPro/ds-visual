import {
	RefObject,
	ReactNode,
	FunctionComponent
} from 'react';
import {
	ArrowType,
	Position,
	FieldType,
	PromiseStatus,
	TrackedActions
} from 'src/services/constants';
import { HashMap } from 'react-move';
import { AnimationBuildOptions } from 'src/utils/utils.interface';

export interface Structure {
	id: number,
	src: string,
	title: string,
	description: string[],
    operations_names?: string[],
    operations_srcs?: string[]
}

export type CallbackFunction = () => void;
export type IFunction = (...args: any[]) => any;

export interface Point {
	x: number,
	y: number
}

export interface ArrowParams {
    matrix: number[],
    length: number
}

export type PromiseCallback<T = any> = (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void;

export interface PromiseDefer<T = {}> {
	promise: PromiseWithStatus<T>,
	resolve: (value?: T | PromiseLike<T>) => void,
	reject: (reason?: any) => void
}

export interface PromiseWithStatus<T> extends Promise<T> {
	status: PromiseStatus
}

// @ts-ignore TODO how to fix????
export type TrackedClassItem = PropertyKey | [PropertyKey, TrackedItemOption];
// @ts-ignore
export type TrackedItemOption = TrackedActions | TrackedClassItem[];

export interface AnimatedNode {
	ref: RefObject<HTMLElement>,
	animationAttrs: any
}

export type ElementViewModel<VType = {}> = NodeViewModel<VType> | ArrowViewModel;

export interface NodeViewModel<VType> {
	id: number,
	ref: RefObject<AnimatedElement>
	value: VType,
	coords: Point,
	inArrows?: Array<number | string>,
	outArrows?: Array<number | string>
}

export interface ArrowViewModel {
	id: number | string,
	ref: RefObject<AnimatedElement>,
	outCoords: Point,
	outNode?: number,
	inCoords: Point,
	inNode?: number,
	type: ArrowType
}

export interface ViewModel<VType> {
	nodes: Array<NodeViewModel<VType>>
	arrows?: ArrowViewModel[]
}

export interface InitialState<M, VType> {
	model: M,
	viewModel: ViewModel<VType>
}

export interface ModelAction {
	name: string,
	method: string,
	mutable: boolean
	prerender?: boolean
}

export interface NodeFactory {
	readonly width: number,
	readonly height: number,
	readonly offset: number,
	readonly sequencePosition: Position,
	component: FunctionComponent<NodeProps | object>,
	getNodeCoords(index: number): Point,
	getFieldCoords(nodeIndex: number, fieldKey: string): Point,
	getFieldSize(field: FieldType): [number, number]
}

export interface NodeProps {
	nodeRef?: RefObject<SVGGElement>,
	attrs?: HashMap,
	children: ReactNode[]
}

export interface HistoryStep {
	id: number | string,
	attrs: HashMap,
	opts?: TrackedActions
}

interface AnimatedElement {
	id: number | string,
	node: SVGGElement,
	animate(animAttrs: any): Promise<any>
}

export type AnimationHistoryStep = ElementAnimationStep | ElementAnimationStep[];

export interface ElementAnimationStep {
	id: number | string,
	ref: RefObject<AnimatedElement>,
	attrs: HashMap,
	action?: TrackedActions,
	previousState?: number | null
}

export interface ADTView<M, VType> {
	state: ViewModel<VType>,
	viewModel: ViewModel<VType>,
	buildViewModel(model: M, history?: HistoryStep[]): void,
	applyViewModel(cb?: CallbackFunction): void,
	prerender(cb?: CallbackFunction): void,
	getAnimationBuildOptions(): AnimationBuildOptions
}

export interface ValidationResponse {
	isValid: boolean,
	errorText?: string
}

export interface Dimension {
	width: number,
	height: number
}
