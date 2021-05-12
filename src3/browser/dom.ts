import { ClassName } from "./classes";

export type ClassDefinitions = {
  className?: ClassName;
  classNames?: ClassName[];
  classMap?: PartialRecord<ClassName, boolean>;
};
export type Events = {
  onClick?: (e: Event) => void;
};
type ElementProps = ClassDefinitions &
  Events & {
    testId?: string;
  };
export const assignClasses = (elem: Element, props: ClassDefinitions) => {
  if (props.className) elem.classList.add(props.className);
  if (props.classNames)
    props.classNames.forEach((cn) => elem.classList.add(cn));
  if (props.classMap) assignClassMap(elem, props.classMap);
};

export const assignClassMap = (
  elem: Element,
  classMap: PartialRecord<ClassName, boolean>
) => {
  Object.entries(classMap).forEach(([className, isSet]) => {
    if (isSet) elem.classList.add(className);
    else elem.classList.remove(className);
  });
};
export const assignEvents = <T extends Element>(elem: T, props: Events): T => {
  if (props.onClick) elem.addEventListener("click", props.onClick);
  return elem;
};

const assignElementProps = <T extends Element>(
  elem: T,
  props: ElementProps
): T => {
  assignClasses(elem, props);
  assignEvents(elem, props);
  if (props.testId) elem.setAttribute("data-testid", props.testId);
  return elem;
};

const assignChildren = <T extends Element>(
  elem: T,
  children: (Element | string)[] | undefined
): T => {
  children?.forEach((c) => {
    if (typeof c === "string") elem.append(c);
    else elem.appendChild(c);
  });

  return elem;
};
type DivProps = ElementProps & {
  children?: (Element | string)[];
};
export const div = (props: DivProps) =>
  assignElementProps(
    assignChildren(document.createElement("div"), props.children),
    props
  );
type SpanProps = ElementProps & {
  text: string;
};
export const span = (props: SpanProps) => {
  const elem = assignElementProps(document.createElement("span"), props);
  elem.textContent = props.text;
  return elem;
};

type ButtonProps = ElementProps & {
  text: string;
};
export const button = (props: ButtonProps) => {
  const elem = assignElementProps(document.createElement("button"), props);
  elem.textContent = props.text;
  return elem;
};

type ImgProps = ElementProps & {
  src: string;
};
export const img = (props: ImgProps) => {
  const elem = assignElementProps(document.createElement("img"), props);
  elem.src = props.src;
  return elem;
};
