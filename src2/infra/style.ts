import { ClassName } from "./index";

const s = document.createElement("style");
document.head.appendChild(s);

const selector = (selector: string, styles: StylesWithOptionalThemes) => {
  const res = Array.isArray(selector) ? selector.join(", ") : selector;
  s.innerHTML += cssToString(res, styles);

  if (styles.themes) handleThemes(selector, styles.themes);
};

const handleThemes = (slctr: string, themes: Themes) => {
  selector(`.dark ${slctr}`, themes.dark);
  selector(`.light ${slctr}`, themes.light);
};

const ignoredStyles: Record<string, number> = {
  onHover: 1,
  themes: 1,
};

type Themes = {
  light: Styles;
  dark: Styles;
};

export type StylesWithOptionalThemes = Styles & {
  themes?: Themes;
};

type ElementStyleModifiers = StylesWithOptionalThemes & {
  onHover?: StylesWithOptionalThemes;
};

type CN = ClassName; //just for being short
type StThemed = StylesWithOptionalThemes;

export const style = {
  selector,
  tag: (tagName: keyof HTMLElementTagNameMap, styles: StThemed) =>
    selector(`${tagName}`, styles),

  class: (className: CN, styles: ElementStyleModifiers) => {
    selector(`.${className}`, styles);
    if (styles.onHover) selector(`.${className}:hover`, styles.onHover);
  },
  parentHover: (parent: CN, child: CN, styles: StThemed) =>
    selector(`.${parent}:hover > .${child}`, styles),
  parentChild: (parent: CN, child: CN, styles: StThemed) =>
    selector(`.${parent} .${child}`, styles),
  parentDirectChild: (parent: CN, child: CN, styles: StThemed) =>
    selector(`.${parent} > .${child}`, styles),
};

const cssToString = (selector: string, props: Styles) => {
  const values = Object.entries(props).map(([key, val]) =>
    typeof val !== "undefined" && !ignoredStyles[key]
      ? `\t${camelToSnakeCase(key)}: ${convertVal(key, val)};`
      : ""
  );
  return `\n${selector}{\n${values.join("\n")}\n}\n`;
};

//I'm using whitelist approach
//in other words I add px to every number values expect 'opacity', 'flex' and other
//and I'm leaving zeros for any value as string without px postfix
const whitelist: Styles = {
  zIndex: 1,
  opacity: 1,
  flex: 1,
  // fontWeight: 1,
  lineHeight: 1,
};

const convertVal = (key: string, val: number | string) => {
  if ((whitelist as any)[key]) return val + "";

  if (typeof val == "number") return val + "px";
  return val + "";
};

export const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

export type Styles = Partial<{
  //display
  opacity: number;

  //sizing
  height: number | "100vh" | "100%";
  width: number | "100vw";
  minWidth: number;
  minHeight: number;

  //margins and paddings
  margin: number;
  marginRight: number | "-100%";
  marginLeft: number;
  marginTop: number;
  marginBottom: number;
  padding: number;
  paddingRight: number;
  paddingLeft: number | string;
  paddingTop: number;
  paddingBottom: number;

  //positioning
  position: "absolute" | "relative" | "fixed";
  top: number;
  right: number;
  bottom: number;
  left: number | string;
  zIndex: number;
  overflow: "hidden" | "auto" | "scroll" | "overlay";

  //flex
  flex: number;
  display: "flex";
  flexDirection: "row" | "column";
  justifyItems: "flex-start" | "center" | "flex-end";
  alignItems: "flex-start" | "center" | "flex-end";

  //border
  border: string;
  outline: string;
  borderRadius: number | "50%";

  //colors
  backgroundColor: string;

  //transitions
  transition: string;

  //typography
  fontFamily: string;
  color: string;
  lineHeight: number;
  fontSize: number;
  fontWeight: "bold";

  //shadows
  boxShadow: string;

  //svg
  stroke: string;
  strokeWidth: number;
  fill: string;

  //background
  backgroundImage: string;
  backgroundSize: "cover";
  backgroundPosition: string;

  //Other
  cursor: "pointer";
  userSelect: "none";
  transform: string;
}>;
