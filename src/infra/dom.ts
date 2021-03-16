import { ClassMap, ClassName } from "./keys";
import { Styles, convertNumericStylesToPixels } from "./style";

export interface ElementWithClassDefinitions {
  className?: ClassName | ClassName[];
  classMap?: ClassMap;
}
export interface ElementProps extends ElementWithClassDefinitions {
  onClick?: (e: Event) => void;
  onMouseDown?: (e: Event) => void;
  testId?: string;
}
export interface HtmlElementProps extends ElementProps {
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

interface InputProps {
  className?: ClassName;
  onInput: (e: Event) => void;
}

export const input = (props: InputProps): HTMLElement => {
  const elem = document.createElement("input");
  assignClasses(elem, props);
  elem.addEventListener("input", props.onInput);
  return elem;
};

interface SpanProps extends HtmlElementProps {}
export const span = (props: SpanProps, text: string): HTMLElement => {
  const elem = document.createElement("span");
  assignClasses(elem, props);
  elem.textContent = text;
  return elem;
};

interface ImgProps extends ElementWithClassDefinitions {
  src: string;
}
export const img = (props: ImgProps): HTMLElement => {
  const elem = document.createElement("img");
  assignClasses(elem, props);
  elem.src = props.src;
  return elem;
};

interface ButtonProps extends ElementWithClassDefinitions {
  text: string;
  onClick?: (e: MouseEvent) => void;
}
export const button = (props: ButtonProps): HTMLElement => {
  const elem = document.createElement("button");
  assignClasses(elem, props);
  elem.textContent = props.text;
  if (props.onClick) elem.addEventListener("click", props.onClick);
  return elem;
};

export const fragment = (nodes: (Node | string)[]) => {
  const fragment = document.createDocumentFragment();
  nodes.forEach((node) => {
    if (typeof node === "string") fragment.append(node);
    else fragment.appendChild(node);
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

//HELPERS
export const assignHtmlElementProps = (
  elem: HTMLElement,
  props: HtmlElementProps
) => {
  assignElementProps(elem, props);
  assignStyles(elem, props.style);
};

export const assignElementProps = (elem: Element, props: ElementProps) => {
  assignClasses(elem, props);
  if (props.onClick) elem.addEventListener("click", props.onClick);
  if (props.onMouseDown) elem.addEventListener("mousedown", props.onMouseDown);
  if (props.testId) elem.setAttribute("data-testid", props.testId);
};

export const assignClasses = (
  elem: Element,
  classDefinitions: ElementWithClassDefinitions
) => {
  if (typeof classDefinitions.className === "string")
    elem.classList.add(classDefinitions.className);
  else if (Array.isArray(classDefinitions.className))
    classDefinitions.className.forEach((cs) => elem.classList.add(cs));

  if (classDefinitions.classMap)
    Object.keys(classDefinitions.classMap)
      .filter((cs) => !!(classDefinitions.classMap as any)[cs])
      .forEach((cs) => elem.classList.add(cs));
};

export const assignStyles = (elem: HTMLElement, style?: Styles) => {
  if (style) {
    const converted = convertNumericStylesToPixels(style);
    Object.keys(converted).forEach((key: any) => {
      elem.style.setProperty(key, converted[key] || null);
    });
  }
};
