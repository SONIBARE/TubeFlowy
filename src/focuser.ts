import { cls, div, fragment, ids } from "./infra";
import { items, events } from "./domain";
import { rowWithChildren } from "./row/rowWithChildren";
import { Minimap } from "./minimap";

export const focusItem = (item: Item) => {
  focusWithoutAnimation(item);
};

const focusWithoutAnimation = (item: Item) => {
  items.setFocusItem(item.id);
  const container = findScrollableContainer();
  const minimap = findMinimap();
  container.innerHTML = ``;
  container.appendChild(
    div(
      {
        className: cls.pageTitle,
        contentEditable: true,
        events: {
          input: ({ currentTarget }) => {
            items.setTitle(
              item,
              (currentTarget as HTMLElement).textContent || ""
            );
          },
        },
      },
      item.title
    )
  );
  container.appendChild(
    fragment(items.getChildrenFor(item.id).map(rowWithChildren))
  );
  minimap.drawCanvas();
  events.dispatchEvent("item-focused", item);
};

// const narrowFocusItem = (item: Item, row: HTMLElement) => {
//   store.itemIdFocused = item.id;
//   const container = findScrollableContainer();

//   container.classList.add(cls.rowsHide);

//   row.parentElement!.classList.add(cls.rowsFocused);

//   const left = -(row.offsetLeft + spacings.negativeMarginForRowAtZeroLevel);
//   const top = -row.offsetTop + window.scrollY;
//   anim.animate(row, [{ fontSize: 16 }, { fontSize: 26 }], {
//     duration: 400,
//     fill: "forwards",
//   });
//   anim
//     .animate(
//       container,
//       [
//         { transform: `translate3d(0, 0, 0)` },
//         { transform: `translate3d(${left}px, ${top}px, 0)` },
//       ],
//       {
//         duration: 400,
//         easing: "ease-out",
//       }
//     )
//     .addEventListener("finish", () => {
//       container.classList.remove(cls.rowsHide);
//       container.innerHTML = ``;
//       const row = myRow(item);
//       window.scrollTo({ top: 0 });
//       (row.firstChild as HTMLElement).style.fontSize = "26px";
//       row.classList.add(cls.rowsFocused);
//       container.appendChild(row);
//     });
// };

// const unfocusToRoot = () => {
//   const container = findScrollableContainer();
//   container.innerHTML = ``;
//   container.appendChild(fragment(store.getRootItems().map(myRow)));
//   const row = document.getElementById(
//     "row-" + store.itemIdFocused
//   ) as HTMLElement;
//   const left = -(row.offsetLeft + spacings.negativeMarginForRowAtZeroLevel);
//   const top = row.offsetTop;
//   //TODO: check if scroll has any effect, if not - use extra translation
//   window.scrollTo({ top: top + window.scrollY });
//   anim.animate(row, [{ fontSize: 26 }, { fontSize: 16 }], {
//     duration: 400,
//     fill: "forwards",
//   });
//   anim.animate(
//     container,
//     [
//       { transform: `translate3d(${left}px, 0, 0)` },
//       { transform: `translate3d(0, 0, 0)` },
//     ],
//     {
//       duration: 400,
//       easing: "ease-out",
//     }
//   );
// };

const findScrollableContainer = (): HTMLElement =>
  document.getElementsByClassName(cls.rowsContainer)[0]
    .firstChild as HTMLElement;

const findMinimap = (): Minimap =>
  document.getElementById(ids.minimap) as Minimap;
