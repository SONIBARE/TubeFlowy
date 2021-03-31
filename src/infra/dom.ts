import { SlapstukEvents } from "./elementEvents";
import { ClassMap, ClassName } from "./keys";
import { Styles, convertNumericStylesToPixels } from "./style";

export interface ElementWithClassDefinitions {
  className?: ClassName | ClassName[];
  classMap?: ClassMap;
}
export interface ElementProps extends ElementWithClassDefinitions {
  events?: Partial<SlapstukEvents>;
  testId?: string;
  id?: string;
}
export interface HtmlElementProps extends ElementProps {
  contentEditable?: boolean;
  draggable?: boolean;
  style?: Styles;
}

interface DivProps extends HtmlElementProps {}

export const div = (
  props: DivProps,
  ...children: (string | Node)[]
): HTMLDivElement => {
  const elem = document.createElement("div");
  assignHtmlElementProps(elem, props);
  children.forEach((c) => {
    if (typeof c === "string") elem.append(c);
    else elem.appendChild(c);
  });
  return elem;
};

interface InputProps extends HtmlElementProps {
  onInput: (e: Event) => void;
}

export const input = (props: InputProps): HTMLElement => {
  const elem = document.createElement("input");
  assignHtmlElementProps(elem, props);
  elem.addEventListener("input", props.onInput);
  return elem;
};

interface SpanProps extends HtmlElementProps {}
export const span = (props: SpanProps, text: string): HTMLElement => {
  const elem = document.createElement("span");
  assignHtmlElementProps(elem, props);
  elem.textContent = text;
  return elem;
};

interface ImgProps extends HtmlElementProps {
  src: string;
}
export const img = (props: ImgProps): HTMLElement => {
  const elem = document.createElement("img");
  assignHtmlElementProps(elem, props);
  elem.src = props.src;
  return elem;
};

interface ButtonProps extends HtmlElementProps {
  text: string;
}
export const button = (props: ButtonProps): HTMLButtonElement => {
  const elem = document.createElement("button");
  assignHtmlElementProps(elem, props);
  elem.textContent = props.text;
  return elem;
};

export const fragment = (nodes: FragmentChild[]): DocumentFragment => {
  const fragment = document.createDocumentFragment();
  nodes.forEach((node) => {
    if (typeof node === "string") fragment.append(node);
    else if (typeof node !== "undefined" && node) fragment.appendChild(node);
  });
  return fragment;
};

interface CanvasProps extends HtmlElementProps {
  width: number;
  height: number;
}
export const canvas = (props: CanvasProps): HTMLCanvasElement => {
  const elem = document.createElement("canvas");
  elem.setAttribute("width", props.width + "");
  elem.setAttribute("height", props.height + "");
  assignHtmlElementProps(elem, props);
  return elem;
};

type FragmentChild = Node | string | undefined | false;

export const setChildren = (elem: Element, ...children: FragmentChild[]) => {
  elem.innerHTML = ``;
  elem.appendChild(fragment(children));
};

//HELPERS
export const assignHtmlElementProps = (
  elem: HTMLElement,
  props: HtmlElementProps
) => {
  assignStyles(elem, props.style);
  assignHtmlProps(elem, props);
};

const assignHtmlProps = (elem: HTMLElement, props: HtmlElementProps) => {
  if (typeof props.contentEditable !== "undefined")
    elem.setAttribute("contenteditable", props.contentEditable + "");
  if (typeof props.draggable !== "undefined")
    elem.setAttribute("draggable", props.draggable + "");
  assignElementProps(elem, props);
};

export const assignElementProps = (elem: Element, props: ElementProps) => {
  assignClasses(elem, props);
  if (props.events) assignEvents(elem, props.events);
  if (props.testId) elem.setAttribute("data-testid", props.testId);
  if (props.id) elem.setAttribute("id", props.id);
};

export const assignClasses = (
  elem: Element,
  classDefinitions: ElementWithClassDefinitions
) => {
  if (typeof classDefinitions.className === "string")
    elem.classList.add(classDefinitions.className);
  else if (Array.isArray(classDefinitions.className))
    classDefinitions.className.forEach((cs) => cs && elem.classList.add(cs));

  if (classDefinitions.classMap)
    Object.keys(classDefinitions.classMap).forEach((cs) => {
      if ((classDefinitions.classMap as any)[cs]) elem.classList.add(cs);
      else elem.classList.remove(cs);
    });
};

const assignEvents = (elem: Element, events: Partial<SlapstukEvents>) => {
  Object.entries(events).forEach(([event, handler]) => {
    if (handler) elem.addEventListener(event, handler as (e: Event) => void);
  });
};

export const assignStyles = (elem: HTMLElement, style?: Styles) => {
  if (style) {
    const converted = convertNumericStylesToPixels(style);
    Object.keys(converted).forEach((key: any) => {
      const val = converted[key];
      if (val) elem.style[key] = val;
    });
  }
};
