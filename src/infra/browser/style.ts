import { ClassName } from "../keys";
// import * as dom from "./dom";
import * as CSS from "csstype";
export type Styles = CSS.Properties<string | number>;

const s = document.createElement("style");
s.innerHTML = ``;
document.head.appendChild(s);

export const selector = (selector: string | string[], styles: Styles) => {
  const res = Array.isArray(selector) ? selector.join(", ") : selector;
  s.innerHTML += cssToString(res, styles);
};

export const cssText = (text: string) => {
  s.innerHTML += text;
};

export const cssToString = (selector: string, props: Styles) => {
  const div = document.createElement("div");
  Object.assign(div.style, convertNumericStylesToPixels(props));
  return `${selector} {
    ${div.style.cssText}
  }
  `;
};

type Transition = Partial<Record<keyof Styles, number>>;

const transition = (transitionDefinition: Transition): {} => {
  const transition = Object.entries(transitionDefinition)
    .map(([key, value]) => `${camelToSnakeCase(key)} ${value}ms`)
    .join(", ");
  return { transition };
};
const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

type Tag = keyof HTMLElementTagNameMap;
export const css = {
  id: (id: string, style: Styles) => selector("#" + id, style),
  tag: (tag: Tag, style: Styles) => selector(tag, style),
  class: (c1: ClassName, style: Styles) => selector(`.${c1}`, style),
  classes: (cs: ClassName[], style: Styles) =>
    selector(cs.map((c) => `.${c}`).join(), style),
  class2: (c1: ClassName, c2: ClassName, style: Styles) =>
    selector(`.${c1}.${c2}`, style),
  class3: (c1: ClassName, c2: ClassName, c3: ClassName, style: Styles) =>
    selector(`.${c1}.${c2}.${c3}`, style),
  parentChild: (c1: ClassName, c2: ClassName, style: Styles) =>
    selector(`.${c1} .${c2}`, style),
  parentParentChild: (
    c1: ClassName,
    c2: ClassName,
    c3: ClassName,
    style: Styles
  ) => selector(`.${c1} .${c2} .${c3}`, style),
  parentChildTag: (c1: ClassName, tag: Tag, style: Styles) =>
    selector(`.${c1} ${tag}`, style),
  parentIdChild: (id1: string, c2: ClassName, style: Styles) =>
    selector(`#${id1} .${c2}`, style),
  parentChildId: (c1: ClassName, id2: string, style: Styles) =>
    selector(`.${c1} #${id2}`, style),

  //pseudoclasses
  onParentHover: (c1: ClassName, c2: ClassName, style: Styles) =>
    selector(`.${c1}:hover .${c2}`, style),
  onClassParentHoverForTag: (c1: ClassName, tag: Tag, style: Styles) =>
    selector(`.${c1}:hover ${tag}`, style),
  active: (className: ClassName, style: Styles) =>
    selector(`.${className}:active`, style),
  hover: (className: ClassName, style: Styles) =>
    selector(`.${className}:hover`, style),
  focus: (className: ClassName, style: Styles) =>
    selector(`.${className}:focus`, style),
  lastOfType: (className: ClassName, style: Styles) =>
    selector(`.${className}:last-of-type`, style),
  firstOfType: (className: ClassName, style: Styles) =>
    selector(`.${className}:first-of-type`, style),
  parentHover: (parentClass: ClassName, childClass: ClassName, style: Styles) =>
    selector(`.${parentClass}:hover .${childClass}`, style),
  childHover: (parentClass: ClassName, childClass: ClassName, style: Styles) =>
    selector(`.${parentClass} .${childClass}:hover`, style),
  childActive: (parentClass: ClassName, childClass: ClassName, style: Styles) =>
    selector(`.${parentClass} .${childClass}:active`, style),

  //pseudoelements
  selection: (className: ClassName, style: Styles) =>
    selector(`.${className}::selection`, style),
  afterClass: (className: ClassName, style: Styles) =>
    selector(`.${className}::after`, style),
  transition,
  text: cssText,
  selector,
};

//I'm using whitelist approach
//in other words I add px to every number values expect 'opacity', 'flex' and other
//and I'm leaving zeros for any value as string without px postfix
const whitelist: Styles = {
  zIndex: 1,
  opacity: 1,
  flex: 1,
  fontWeight: 1,
  lineHeight: 1,
};
export const convertNumericStylesToPixels = (
  s: Styles
): Partial<CSSStyleDeclaration> => {
  let res: any = {};
  const sCo = s as any;
  Object.keys(s).forEach((key) => {
    if (
      typeof sCo[key] == "string" ||
      !!(whitelist as any)[key] ||
      sCo[key] === 0
    )
      res[key] = sCo[key] + "";
    else res[key] = sCo[key] + "px";
  });
  return res;
};
