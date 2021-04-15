import { anim, cls, colors, css, div, dom } from "../../infra";
import { row } from "./row";
import { items } from "../domain";

export default class ItemView {
  private itemRow: HTMLElement;
  private itemChildren: HTMLElement | undefined;

  constructor(public item: Item, public level: number) {
    const cleanup = items.onItemCollapseExpand(
      this.item.id,
      this.updateItemChildren
    );
    this.itemRow = row(item, level, cleanup);
    this.itemChildren = this.isItemOpen() ? this.viewChildren() : undefined;
  }

  render = () => dom.fragment([this.itemRow, this.itemChildren]);

  static viewItemChildren = (item: Item, level = 0): Node =>
    dom.fragment(
      items
        .getChildrenFor(item.id)
        .map((child) => new ItemView(child, level))
        .map((itemView) => itemView.render())
    );

  private viewChildren = () =>
    this.item.title ===
    "Product Design Course | Tech Entrepreneur Nanodegree Program"
      ? this.viewGalleryChildren()
      : this.viewRegularChildren();

  private viewRegularChildren = (): HTMLElement =>
    dom.div(
      {
        className: [cls.treeRowChildren],
      },
      ItemView.viewItemChildren(this.item, this.level + 1),
      dom.div({
        className: [
          cls.childrenBorder,
          ("children-level_" + this.level) as any,
        ],
      })
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
        ...items
          .getChildrenFor(this.item.id)
          .map((child) => div({ className: cls.box }, child.title))
          .concat([div({ className: cls.lastBox })])
      )
    );

  private updateItemChildren = () => {
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

  private isItemOpen = () => items.isFolderOpenOnPage(this.item);
}

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

css.class(cls.treeRowChildren, {
  position: "relative",
});

css.class(cls.childrenBorder, {
  position: "absolute",
  width: 2,
  // height: 30,
  backgroundColor: colors.lightPrimary,
  top: 0,
  bottom: 0,
});
// css.class(cls.treeRowChildren, {
//   marginLeft: 30,
//   borderLeft: `2px solid ${colors.darkPrimary}`,
// });

css.selector(`.${cls.itemGalleryContent}::-webkit-scrollbar`, {
  height: 8,
});

css.selector(`.${cls.itemGalleryContent}::-webkit-scrollbar-thumb`, {
  backgroundColor: colors.mediumPrimary,
});
