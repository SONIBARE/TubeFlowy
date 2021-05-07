import { ClassName } from "./index";

const s = document.createElement("style");
document.head.appendChild(s);

const selector = (selector: string | string[], styles: Styles) => {
  const res = Array.isArray(selector) ? selector.join(", ") : selector;
  s.innerHTML += cssToString(res, styles);
};

const modifiers: Record<string, number> = {
  onHover: 1,
};

type ElementStyleModifiers = Styles & {
  onHover?: Styles;
};

export const style = {
  selector,
  class: (className: ClassName, styles: ElementStyleModifiers) => {
    selector(`.${className}`, styles);
    if (styles.onHover) selector(`.${className}:hover`, styles.onHover);
  },
  parentHover: (parent: ClassName, child: ClassName, styles: Styles) =>
    selector(`.${parent}:hover > .${child}`, styles),
};

const cssToString = (selector: string, props: Styles) => {
  const values = Object.entries(props).map(([key, val]) =>
    typeof val !== "undefined" && !modifiers[key]
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
  height: number | "100vh";
  width: number | "100vw";
  minWidth: number;

  //margins and paddings
  margin: 0;
  marginRight: number | "-100%";
  marginLeft: number;
  marginTop: number;
  marginBottom: number;
  padding: 0;
  paddingRight: number;
  paddingLeft: number | string;
  paddingTop: number;
  paddingBottom: number;

  //positioning
  position: "absolute" | "relative";
  zIndex: number;
  overflow: "hidden" | "auto" | "scroll";

  //flex
  flex: number;
  display: "flex";
  flexDirection: "row" | "column";
  justifyItems: "flex-start" | "center" | "flex-end";
  alignItems: "flex-start" | "center" | "flex-end";

  //border
  borderRadius: number;

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

  //Other
  cursor: "pointer";
  userSelect: "none";
}>;
