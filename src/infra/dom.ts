import { ClassMap, ClassName } from "./keys";
import { Styles, convertNumericStylesToPixels } from "./style";

export interface ElementWithClassDefinitions {
  className?: ClassName | ClassName[];
  classMap?: ClassMap;
}

interface DivProps extends ElementWithClassDefinitions {
  style?: Styles;
}

export const div = (
  props: DivProps,
  ...children: (string | Node)[]
): HTMLDivElement => {
  const elem = document.createElement("div");
  assignClasses(elem, props);
  if (props.style) assignStyles(elem, props.style);
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

interface DivProps {
  className?: ClassName;
}
export const span = (props: DivProps, text: string): HTMLElement => {
  const elem = document.createElement("span");
  assignClasses(elem, props);
  elem.textContent = text;
  return elem;
};

interface ImgProps {
  className?: ClassName;
  src: string;
}
export const img = (props: ImgProps): HTMLElement => {
  const elem = document.createElement("img");
  assignClasses(elem, props);
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

export const assignStyles = (elem: HTMLElement, style: Styles) => {
  const converted = convertNumericStylesToPixels(style);
  Object.keys(converted).forEach((key: any) => {
    elem.style.setProperty(key, converted[key] || null);
  });
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
