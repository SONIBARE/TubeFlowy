import { cls, svg, circle, colors, spacings } from "./infra";

import { store } from "./state";
import { focusItem } from "./focuser";

//TODO: consider where to place this method (common with sideScroll.ts)
const isLightCircleTransparent = (item: Item) =>
  store.isFolderOpenOnPage(item) || store.isEmptyAndNoNeedToLoad(item);

export const appendFocusCicrle = (item: Item, elem: HTMLElement): EmptyFunc => {
  const lightCircle = circle({
    className: cls.lightCircle,
    cx: spacings.outerRadius,
    cy: spacings.outerRadius,
    r: spacings.outerRadius,
    fill: colors.lightPrimary,
  });

  const animateLightCircle = (item: Item) => {
    if (isLightCircleTransparent(item))
      lightCircle.classList.add(cls.transparent);
    else lightCircle.classList.remove(cls.transparent);
  };

  elem.appendChild(
    svg(
      {
        onClick: () => focusItem(item),
        className: cls.focusCircleSvg,
        viewBox: `0 0 ${spacings.outerRadius * 2} ${spacings.outerRadius * 2}`,
      },
      lightCircle,
      circle({
        className: cls.outerCircle,
        cx: spacings.outerRadius,
        cy: spacings.outerRadius,
        r: spacings.outerRadius,
        fill: colors.mediumPrimary,
      }),
      circle({
        cx: spacings.outerRadius,
        cy: spacings.outerRadius,
        r: spacings.innerRadius,
        fill: colors.darkPrimary,
      })
    )
  );

  const unsub = store.addEventListener(
    "itemChanged." + item.id,
    animateLightCircle
  );
  animateLightCircle(item);
  return unsub;
};
