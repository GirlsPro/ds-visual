export class Stack<VType> implements ADTStack<VType> {

	public static readonly OUT_OF_DOMAIN: number = -1;
	public static readonly STACK_SIZE: number = 10;

	private readonly stack: VType[];
	private up: number;
	private _up: number;

	constructor() {
		// Use defineProperty in order to return value from setter
		Object.defineProperty(this, 'up', {
			get() {
				return this._up;
			},
			set(v) {
				const prevValue = this._up;
				this._up = v;
				return prevValue;
			},
			configurable: true
		});

		this.stack = new Array(Stack.STACK_SIZE).fill(null);
		this.reset();
	}

	public push(value: VType): void {
		this.stack[++this.up] = value;
	}

	public pop(): VType {
		return this.stack[this.up--];
	}

	public top(): VType {
		return this.stack[this.up];
	}

	public erase(): void {
		this.reset();
	}

	public full(): boolean {
		return this.up === Stack.STACK_SIZE - 1;
	}

	public empty(): boolean {
		return this.up === Stack.OUT_OF_DOMAIN;
	}

	private reset(): void {
		this.up = Stack.OUT_OF_DOMAIN;
	}
}
