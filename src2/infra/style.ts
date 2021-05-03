import { ClassName } from "./index";

const s = document.createElement("style");
document.head.appendChild(s);

type AllStyles = {
  margin: number | string;
  color: string;
  opacity: number;
  lineHeight: number;
  fontSize: number;
};

type Styles = Partial<AllStyles>;

const selector = (selector: string | string[], styles: Styles) => {
  const res = Array.isArray(selector) ? selector.join(", ") : selector;
  s.innerHTML += cssToString(res, styles);
};

export const style = {
  selector,
  class: (className: ClassName, styles: Styles) =>
    selector("." + className, styles),
};

const cssToString = (selector: string, props: Styles) => {
  const values = Object.entries(props).map(([key, val]) =>
    typeof val !== "undefined"
      ? `\t${camelToSnakeCase(key)}: ${convertVal(key, val)};`
      : ""
  );
  return `\n${selector}{\n${values.join("\n")}\n}\n`;
};

//I'm using whitelist approach
//in other words I add px to every number values expect 'opacity', 'flex' and other
//and I'm leaving zeros for any value as string without px postfix
const whitelist: Styles = {
  // zIndex: 1,
  // opacity: 1,
  // flex: 1,
  // fontWeight: 1,
  // lineHeight: 1,
};

const convertVal = (key: string, val: number | string) => {
  if ((whitelist as any)[key]) return val + "";

  if (typeof val == "number") return val + "px";
  return val + "";
};

const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
