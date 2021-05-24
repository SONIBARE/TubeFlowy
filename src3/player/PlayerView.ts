import { css, cssVar, dom, style } from "../browser";
import { spacings, timings } from "../designSystem";

class PlayerView {
  constructor(private container: Element) {
    container.appendChild(dom.div({ id: "youtube-frame" }));
  }
}

export default PlayerView;

style.class("footer", {
  height: spacings.playerFooterHeight,
  transition: css.transition({ backgroundColor: timings.themeSwitchDuration }),
  backgroundColor: css.useVar(cssVar.menuColor),
});

style.id(`youtube-frame`, {
  position: "fixed",
  bottom: spacings.playerFooterHeight + 20,
  right: 20,
  width: 400,
  height: 150,
});
