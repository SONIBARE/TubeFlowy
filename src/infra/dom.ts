import { ClassName } from "./keys";
import { Styles, convertNumericStylesToPixels } from "./style";

interface DivProps {
  className?: ClassName;
  style?: Styles;
}

export const div = (
  props: DivProps,
  ...children: (string | Node)[]
): HTMLDivElement => {
  const elem = document.createElement("div");
  if (props.className) elem.classList.add(props.className);
  if (props.style) assignStyles(elem, props.style);
  children.forEach((c) => {
    if (typeof c === "string") elem.append(c);
    else elem.appendChild(c);
  });
  return elem;
};

export const assignStyles = (elem: HTMLElement, style: Styles) => {
  const converted = convertNumericStylesToPixels(style);
  Object.keys(converted).forEach((key: any) => {
    elem.style.setProperty(key, converted[key] || null);
  });
};

interface InputProps {
  className?: ClassName;
  onInput: (e: Event) => void;
}

export const input = (props: InputProps): HTMLElement => {
  const elem = document.createElement("input");
  if (props.className) elem.classList.add(props.className);
  elem.addEventListener("input", props.onInput);
  return elem;
};

interface DivProps {
  className?: ClassName;
}
export const span = (props: DivProps, text: string): HTMLElement => {
  const elem = document.createElement("span");
  if (props.className) elem.classList.add(props.className);
  elem.textContent = text;
  return elem;
};

interface ImgProps {
  className?: ClassName;
  src: string;
}
export const img = (props: ImgProps): HTMLElement => {
  const elem = document.createElement("img");
  if (props.className) elem.classList.add(props.className);
  elem.src = props.src;
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
