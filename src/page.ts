import { ui } from "./domain";
import { cls, css, dom, Styles } from "./infra";

export const viewAppShell = (): Node =>
  dom.div({ className: cls.pageContainer }, header(), main(), playerFooter());

const header = () => dom.div({ className: cls.header });
const playerFooter = () => dom.div({ className: cls.playerFooter });

const main = () => dom.div({ className: cls.main }, mainTab(), searchTab());

const mainTab = () => {
  const tab = dom.div({ testId: "main", className: cls.mainTab });
  ui.bindToFocus((part) =>
    dom.toggleClass(tab, cls.tabFocused, part == "main")
  );
  return tab;
};

const searchTab = () => {
  const tab = dom.div({ testId: "search", className: cls.searchTab }, "Search");
  ui.bindToVisilibty((isVisible) =>
    dom.toggleClass(tab, cls.searchTabHidden, !isVisible)
  );
  ui.bindToFocus((part) => {
    dom.toggleClass(tab, cls.tabFocused, part == "search");
  });
  return tab;
};

const flexRow = (): Styles => ({ display: "flex", flexDirection: "row" });

const flexColumn = (): Styles => ({ display: "flex", flexDirection: "column" });

css.class(cls.pageContainer, {
  height: "100vh",
  width: "100vw",
  overflow: "hidden",
  ...flexColumn(),
});

css.class(cls.header, {
  height: 60,
  backgroundColor: "lightGrey",
});

css.class(cls.playerFooter, {
  height: 60,
  backgroundColor: "lightGrey",
});

css.class(cls.main, {
  flex: 1,
  ...flexRow(),
});

css.class(cls.searchTab, {
  flex: 1,
  backgroundColor: "lightYellow",
  ...css.transition({ marginRight: 200 }),
});

css.class(cls.searchTabHidden, {
  marginRight: "-100%",
});

css.class(cls.mainTab, {
  flex: 1,
});

css.class(cls.tabFocused, {
  backgroundColor: "pink",
});

css.tag("body", { margin: 0 });
