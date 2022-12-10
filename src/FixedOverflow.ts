interface FixedOverflowConfig {
  elements?: Element[];
  elementSelector?: string;
}

class FixedOverflow {
  elements?: Element[];
  elementSelector?: string;
  targetElements: HTMLElement[] = [];
  _currentScrollPosition: number = 0;
  private maskedElements = new Map<HTMLElement, HTMLElement>();

  get currentScrollPosition() {
    return this._currentScrollPosition;
  }
  set currentScrollPosition(value: number) {
    this._currentScrollPosition = value;
    this.calculateFixedOverflows();
  }

  constructor({ elements, elementSelector }: FixedOverflowConfig) {
    if (!elements && !elementSelector) {
      throw new Error("one of these: elements, elementSelector is required");
    }
    this.elements = elements;
    this.elementSelector = elementSelector;
    this.setTargets();
    this.addEventListener();
    this.currentScrollPosition = window.scrollY;
  }

  setTargets() {
    const { elements, elementSelector } = this;
    if (elements) {
      this.targetElements = elements as HTMLElement[];
    } else if (elementSelector) {
      this.targetElements = [
        ...document.querySelectorAll(elementSelector),
      ] as HTMLElement[];
    } else {
      throw new Error("one of these: elements, elementSelector is required");
    }
  }

  createMaskedElement(
    fixedElement: Element,
    className: string,
    allClassNames: string[]
  ) {
    fixedElement.classList.remove(className);
    const masked = fixedElement.cloneNode(true) as HTMLElement;
    allClassNames.forEach((c) => {
      masked.classList.remove(c);
    });
    fixedElement.parentNode.insertBefore(masked, fixedElement.nextSibling);
    masked.classList.add(className);
    return masked;
  }

  maskFullyVisible(
    mask: HTMLElement,
    target: HTMLElement,
    className = null,
    allClassNames = []
  ) {
    allClassNames.forEach((c) => {
      target.classList.remove(c);
    });
    (target.childNodes[0] as HTMLElement).style.height = "auto";
    if (className) {
      target.classList.add(className);
    }
    if (mask) {
      mask.parentNode.removeChild(mask);
    }
  }

  calculateOverflow({
    target,
    masked,
    targetBounding,
    yOverflow,
  }: {
    target: HTMLElement;
    masked: HTMLElement;
    targetBounding: DOMRect;
    yOverflow: number;
  }) {
    const targetMask = target.childNodes[0] as HTMLElement;
    const maskedElementMask = masked.childNodes[0] as HTMLElement;
    target.style.height = `${targetBounding.height}px`;
    masked.style.height = `${targetBounding.height}px`;
    targetMask.style.height = `${targetBounding.height}px`;
    maskedElementMask.style.height = `${targetBounding.height}px`;
    targetMask.style.overflow = "hidden";
    maskedElementMask.style.overflow = "hidden";

    // targetMask.style.height = `${yOverflow - targetBounding.y}px`;

    maskedElementMask.style.height = `${
      targetBounding.y + targetBounding.height - yOverflow
    }px`;
    maskedElementMask.style.transform = `translateY(${
      yOverflow - targetBounding.y
    }px)`;
    maskedElementMask.childNodes.forEach(
      (c: HTMLElement) =>
        (c.style.transform = `translateY(-${yOverflow - targetBounding.y}px)`)
    );
  }

  calculateFixedOverflows() {
    const overflowElements = document.querySelectorAll("[data-overflow-class]");
    const overflowClassList = [...overflowElements].map(
      (o: HTMLElement) => o.dataset.overflowClass
    );
    overflowElements.forEach((overflow: HTMLElement, index) => {
      const overflowBounding = overflow.getBoundingClientRect();
      const overflowClass = overflow.dataset.overflowClass;
      this.targetElements.forEach((target) => {
        const targetBounding = target.getBoundingClientRect();
        if (
          targetBounding.y < overflowBounding.y &&
          targetBounding.y + targetBounding.height > overflowBounding.y
        ) {
          if (!this.maskedElements.has(target)) {
            const maskedElement = this.createMaskedElement(
              target,
              overflowClass,
              overflowClassList
            );
            this.maskedElements.set(target, maskedElement);
          }
          const maskedElement = this.maskedElements.get(target);
          this.calculateOverflow({
            target,
            masked: maskedElement as HTMLElement,
            targetBounding,
            yOverflow: overflowBounding.y,
          });
        } else if (
          index === 0 &&
          targetBounding.y + targetBounding.height < overflowBounding.y
        ) {
          this.maskFullyVisible(this.maskedElements.get(target), target);
          this.maskedElements.delete(target);
        } else if (
          targetBounding.y > overflowBounding.y &&
          targetBounding.y < overflowBounding.y + overflowBounding.height
        ) {
          this.maskFullyVisible(
            this.maskedElements.get(target),
            target,
            overflow.dataset.overflowClass,
            overflowClassList
          );
          this.maskedElements.delete(target);
        }
      });
    });
  }

  handleScrollElement = (e) => {
    this.currentScrollPosition = window.scrollY;
  };

  addEventListener() {
    window.addEventListener("scroll", this.handleScrollElement);
  }
}

export default FixedOverflow;
