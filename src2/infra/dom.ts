import { ClassName } from "../designSystem";

type ClassDefinitions = {
  className?: ClassName;
};

type DivProps = ClassDefinitions & {
  onClick?: () => void;
};

export const div = (
  props: DivProps,
  ...children: (string | Node | undefined)[]
): HTMLElement => {
  const elem = document.createElement("div");

  if (props.onClick) elem.addEventListener("click", props.onClick);
  assignClasses(elem, props);

  children.forEach((c) => {
    if (typeof c === "string") elem.append(c);
    else if (c) elem.appendChild(c);
  });
  return elem;
};

const assignClasses = (elem: Element, props: ClassDefinitions) => {
  if (props.className) elem.classList.add(props.className);
};
