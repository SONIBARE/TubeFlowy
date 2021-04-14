import { anim, cls, colors, css, div, dom } from "../../infra";
import { ItemsStore } from "../ItemsStore";

export default class ItemView {
  private itemRow: HTMLElement;
  private itemChildren: HTMLElement | undefined;

  private expandButton: HTMLElement;

  constructor(
    public item: Item,
    public level: number,
    public store: ItemsStore
  ) {
    this.expandButton = this.viewExpandButton();
    this.itemRow = this.viewRow();
    this.itemChildren = this.isItemOpen() ? this.viewChildren() : undefined;
    this.assignListeners();
  }

  render = () => dom.fragment([this.itemRow, this.itemChildren]);

  static viewItemChildren = (item: Item, level = 0, store: ItemsStore): Node =>
    dom.fragment(
      store
        .getChildrenFor(item.id)
        .map((child) => new ItemView(child, level, store))
        .map((itemView) => itemView.render())
    );

  private viewRow = () =>
    dom.div(
      {
        id: "row-" + this.item.id,
        className: [cls.treeRow, ("level_" + this.level) as any],
        onRemovedFromDom: this.cleanup,
      },
      this.expandButton,
      this.item.title,
      dom.button({
        text: "f",
        testId: "focuser-" + this.item.id,
        events: { click: () => this.store.focusItem(this.item.id) },
      })
    );

  private viewExpandButton = () =>
    dom.button({
      testId: "chevron-" + this.item.id,
      text: "",
      events: { click: () => this.store.toggleItemVisibility(this.item) },
    });

  private viewChildren = () =>
    this.item.title ===
    "Product Design Course | Tech Entrepreneur Nanodegree Program"
      ? this.viewGalleryChildren()
      : this.viewRegularChildren();

  private viewRegularChildren = (): HTMLElement =>
    dom.div(
      {},
      ItemView.viewItemChildren(this.item, this.level + 1, this.store)
    );

  private viewGalleryChildren = (): HTMLElement =>
    //this outer container is used to animate height without triggering reflow of wrapped flex gallery
    div(
      {},
      div(
        {
          className: [
            cls.itemGalleryContent,
            ("level_" + (this.level + 1)) as any,
          ],
          style: { height: 200 },
        },
        ...this.store
          .getChildrenFor(this.item.id)
          .map((child) => div({ className: cls.box }, child.title))
          .concat([div({ className: cls.lastBox })])
      )
    );

  private updateExpandButton = () =>
    (this.expandButton.textContent = this.isItemOpen() ? "-" : "+");

  private onCleanup: EmptyFunc | undefined;
  private assignListeners = () => {
    this.onCleanup = this.store.onItemCollapseExpand(
      this.item.id,
      this.updateItemVisibility
    );
    this.updateExpandButton();
  };

  private cleanup = () => {
    this.onCleanup && this.onCleanup();
  };

  private updateItemVisibility = () => {
    this.updateExpandButton();
    if (this.isItemOpen()) this.expandChildren();
    else this.collapseChildren();
  };

  private expandChildren = () => {
    if (this.itemChildren) anim.revertCurrentAnimations(this.itemChildren);
    else {
      this.itemChildren = this.viewChildren();
      this.itemRow.insertAdjacentElement("afterend", this.itemChildren);
      anim
        .expandHeight(this.itemChildren)
        .addEventListener("finish", this.onAnimationFinish);
    }
  };

  private collapseChildren = () => {
    if (this.itemChildren && !anim.revertCurrentAnimations(this.itemChildren))
      anim
        .collapseHeight(this.itemChildren)
        .addEventListener("finish", this.onAnimationFinish);
  };

  private onAnimationFinish = () => {
    if (this.itemChildren && !this.isItemOpen()) {
      this.itemChildren.remove();
      this.itemChildren = undefined;
    }
  };

  private isItemOpen = () => this.store.isFolderOpenOnPage(this.item);
}

const numberOfLevelsToGenerate = 21;

const TREE_MAX_WIDTH = 700;

for (let level = 0; level < numberOfLevelsToGenerate; level++) {
  const base = `max((100% - ${TREE_MAX_WIDTH}px) / 2, 20px)`;
  const levelPadding = `${level * 20}px`;
  css.text(`
    .level_${level}{
        padding-left: calc(${base} + ${levelPadding});
        padding-right: 20px;
    }
`);
}

css.class(cls.treeRow, {
  cursor: "pointer",
  display: "flex",
  justifyItems: "center",
  alignItems: "flex-start",
});

css.hover(cls.treeRow, {
  backgroundColor: colors.superLight,
});

css.class(cls.itemGalleryContent, {
  overflowX: "overlay" as any,
  overflowY: "hidden",
  display: "flex",
  flexDirection: "column",
  flexWrap: "wrap",
  paddingBottom: 20,
});

css.class(cls.box, {
  height: 30,
  backgroundColor: colors.darkPrimary,
  marginTop: 20,
  marginLeft: 20,
  color: "white",
});

css.class(cls.lastBox, {
  height: "100%",
  width: 20,
});

css.selector(`.${cls.itemGalleryContent}::-webkit-scrollbar`, {
  height: 8,
});

css.selector(`.${cls.itemGalleryContent}::-webkit-scrollbar-thumb`, {
  backgroundColor: colors.mediumPrimary,
});
