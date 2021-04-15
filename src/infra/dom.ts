import { SlapstukEvents } from "./elementEvents";
import { ClassMap, ClassName } from "./keys";
import { Styles, convertNumericStylesToPixels } from "./style";

export interface ElementWithClassDefinitions {
  className?: ClassName | ClassName[];
  classMap?: ClassMap;
}
export interface ElementProps<T extends EventTarget>
  extends ElementWithClassDefinitions {
  events?: Partial<SlapstukEvents<T>>;
  testId?: string;
  id?: string;
}
export interface HtmlElementProps<T extends EventTarget>
  extends ElementProps<T> {
  contentEditable?: boolean;
  draggable?: boolean;
  style?: Styles;
}

interface DivProps extends HtmlElementProps<HTMLDivElement> {
  onRemovedFromDom?: () => void;
}

export const div = (
  props: DivProps,
  ...children: (string | Node | undefined)[]
): HTMLElement => {
  const createElement = (): HTMLElement => {
    if (props.onRemovedFromDom) {
      const res = document.createElement("tbf-div") as MyComponent;
      res.onDisconnected = props.onRemovedFromDom;
      return res;
    } else {
      return document.createElement("div");
    }
  };

  const elem = createElement();

  assignHtmlElementProps(elem, props);
  children.forEach((c) => {
    if (typeof c === "string") elem.append(c);
    else if (c) elem.appendChild(c);
  });
  return elem;
};

class MyComponent extends HTMLElement {
  public onDisconnected: EmptyFunc | undefined;
  disconnectedCallback() {
    if (this.onDisconnected) this.onDisconnected();
  }
}

customElements.define("tbf-div", MyComponent);

interface InputProps extends HtmlElementProps<HTMLInputElement> {
  placeholder?: string;
  onInput?: (e: Event) => void;
  type?: "range" | "color";
  value?: number | string;
  min?: number;
  max?: number;
}

export const input = (props: InputProps): HTMLInputElement => {
  const elem = document.createElement("input");
  assignHtmlElementProps(elem, props);
  if (props.onInput) elem.addEventListener("input", props.onInput);
  if (props.placeholder) elem.setAttribute("placeholder", props.placeholder);

  if (props.type) elem.setAttribute("type", props.type);
  if (props.value) elem.setAttribute("value", props.value + "");
  if (props.min) elem.setAttribute("min", props.min + "");
  if (props.max) elem.setAttribute("max", props.max + "");
  return elem;
};

interface SpanProps extends HtmlElementProps<HTMLSpanElement> {}
export const span = (props: SpanProps, text: string): HTMLElement => {
  const elem = document.createElement("span");
  assignHtmlElementProps(elem, props);
  elem.textContent = text;
  return elem;
};

interface ImgProps extends HtmlElementProps<HTMLImageElement> {
  src: string;
}
export const img = (props: ImgProps): HTMLElement => {
  const elem = document.createElement("img");
  assignHtmlElementProps(elem, props);
  elem.src = props.src;
  return elem;
};

interface ButtonProps extends HtmlElementProps<HTMLButtonElement> {
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

interface CanvasProps extends HtmlElementProps<HTMLCanvasElement> {
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

export const removeAllChildren = (elem: Node) => {
  while (elem.firstChild) elem.removeChild(elem.firstChild);
};

type FragmentChild = Node | string | undefined | false;

export const setChildren = (elem: Node, ...children: FragmentChild[]) => {
  removeAllChildren(elem);
  elem.appendChild(fragment(children));
};

export const append = (elem: Element, ...children: FragmentChild[]) =>
  elem.appendChild(fragment(children));

//HELPERS
export const assignHtmlElementProps = <T extends EventTarget>(
  elem: HTMLElement,
  props: HtmlElementProps<T>
) => {
  assignStyles(elem, props.style);
  assignHtmlProps(elem, props);
};

const assignHtmlProps = <T extends EventTarget>(
  elem: HTMLElement,
  props: HtmlElementProps<T>
) => {
  if (typeof props.contentEditable !== "undefined")
    elem.setAttribute("contenteditable", props.contentEditable + "");
  if (typeof props.draggable !== "undefined")
    elem.setAttribute("draggable", props.draggable + "");
  assignElementProps(elem, props);
};

export const assignElementProps = <T extends EventTarget>(
  elem: Element,
  props: ElementProps<T>
) => {
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

export const toggleClass = (
  elem: Element,
  className: ClassName,
  isPresent: boolean
) => {
  if (isPresent) elem.classList.add(className);
  else elem.classList.remove(className);
};

export const removeClass = (elem: Element, className: ClassName) =>
  toggleClass(elem, className, false);

export const addClass = (elem: Element, className: ClassName) =>
  toggleClass(elem, className, true);

const assignEvents = <T extends EventTarget>(
  elem: Element,
  events: Partial<SlapstukEvents<T>>
) => {
  Object.entries(events).forEach(([event, handler]) => {
    if (handler) elem.addEventListener(event, handler as any);
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
