interface FixedOverflowConfig {
    elements?: Element[];
    elementSelector?: string;
}
declare class FixedOverflow {
    elements?: Element[];
    elementSelector?: string;
    targetElements: HTMLElement[];
    _currentScrollPosition: number;
    private maskedElements;
    get currentScrollPosition(): number;
    set currentScrollPosition(value: number);
    constructor({ elements, elementSelector }: FixedOverflowConfig);
    setTargets(): void;
    createMaskedElement(fixedElement: Element, className: string, allClassNames: string[]): HTMLElement;
    maskFullyVisible(mask: HTMLElement, target: HTMLElement, className?: any, allClassNames?: any[]): void;
    calculateOverflow({ target, masked, targetBounding, yOverflow, }: {
        target: HTMLElement;
        masked: HTMLElement;
        targetBounding: DOMRect;
        yOverflow: number;
    }): void;
    calculateFixedOverflows(): void;
    handleScrollElement: (e: any) => void;
    addEventListener(): void;
}
export default FixedOverflow;
