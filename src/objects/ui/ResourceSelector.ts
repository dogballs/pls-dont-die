import { GameObject, Rect, Subject } from '../../core';
import { ResourceType, Resource } from '../../game';

import { ArrowButton } from './ArrowButton';
import { ResourceItem } from './ResourceItem';

type SelectorOptions = {
  defaultValue?: ResourceType;
  locked?: boolean;
  blinkNext?: boolean;
  getRequiredAmount?: (resource: Resource) => number;
};

export class ResourceSelector extends GameObject {
  changed = new Subject<ResourceType>();

  private options: SelectorOptions;
  private selectedIndex;
  private arrowLeft: ArrowButton;
  private arrowRight: ArrowButton;
  private item: ResourceItem;
  // private label: GameObject;

  constructor(
    private readonly resources: Resource[],
    options: SelectorOptions = {},
  ) {
    super(256, 32);

    this.options = Object.assign(
      {},
      {
        defaultValue: undefined,
        locked: false,
        blinkNext: false,
        getRequiredAmount: undefined,
      },
      options,
    );
  }

  // setDisabled() {
  //   this.arrowLeft.setDisabled(true);
  //   this.arrowRight.setDisabled(true);
  // }

  protected setup() {
    this.arrowLeft = new ArrowButton('left');
    this.arrowLeft.position.set(8, 0);
    this.arrowLeft.clicked.addListener(() => {
      this.selectPrev();
    });
    if (this.options.locked) {
      this.arrowLeft.setDisabled(true);
    }
    this.add(this.arrowLeft);

    this.arrowRight = new ArrowButton('right', this.options.blinkNext);
    this.arrowRight.position.set(216, 0);
    this.arrowRight.clicked.addListener(() => {
      this.selectNext();
    });
    if (this.options.locked) {
      this.arrowRight.setDisabled(true);
    }
    this.add(this.arrowRight);

    const defaultIndex = this.resources.findIndex(
      (resource) => resource.type === this.options.defaultValue,
    );
    const selectedIndex = defaultIndex >= 0 ? defaultIndex : 0;
    this.selectIndex(selectedIndex);
  }

  private getSelectedChoice() {
    return this.resources[this.selectedIndex];
  }

  private hasNext() {
    return this.selectedIndex < this.resources.length - 1;
  }

  private hasPrev() {
    return this.selectedIndex > 0;
  }

  private selectPrev() {
    const nextIndex = Math.max(this.selectedIndex - 1, 0);
    this.selectIndex(nextIndex);
  }

  private selectNext() {
    const nextIndex = Math.min(
      this.selectedIndex + 1,
      this.resources.length - 1,
    );
    this.selectIndex(nextIndex);
  }

  private selectIndex(nextIndex: number) {
    if (this.resources.length === 0) {
      return;
    }
    if (this.selectedIndex === nextIndex) {
      return;
    }
    this.selectedIndex = nextIndex;

    const resource = this.resources[this.selectedIndex];

    let requiredAmount = undefined;
    // if (this.options.getRequiredAmount) {
    //   requiredAmount = this.options.getRequiredAmount(resource);
    // }

    this.remove(this.item);
    this.item = new ResourceItem({
      type: resource.type,
      // amount: resource.amount,
      iconRect: new Rect(0, 0, 16, 16),
      requiredAmount,
    });
    this.item.position.set(70, 0);
    this.add(this.item);

    this.arrowLeft.setDisabled(!this.hasPrev());
    this.arrowRight.setDisabled(!this.hasNext());

    this.changed.notify(this.getSelectedChoice().type);
  }

  // private updateLabelText() {
  //   const painter = this.label.painter as TextPainter;
  //   painter.setOptions({ text: this.getSelectedChoice().label });

  //   if (!this.options.locked) {
  //     this.arrowLeft.setDisabled(!this.hasPrev());
  //     this.arrowRight.setDisabled(!this.hasNext());
  //   }
  // }
}
