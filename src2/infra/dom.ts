import { ClassName } from "./index";

type ClassDefinitions = {
  className?: ClassName;
};

type Events = {
  onClick?: () => void;
};

type ElementProps = {
  id?: string;
};

type HTMLElementProps = ClassDefinitions & Events & ElementProps;

type DivProps = HTMLElementProps;

export const div = (
  props: DivProps,
  ...children: (string | Node | undefined)[]
): HTMLElement => {
  const elem = document.createElement("div");

  assignHtmlElementProps(elem, props);

  children.forEach((c) => {
    if (typeof c === "string") elem.append(c);
    else if (c) elem.appendChild(c);
  });
  return elem;
};

type ButtonProps = HTMLElementProps;
export const button = <T>(
  props: ButtonProps,
  text?: string | Sub<T, string>
): HTMLElement => {
  const elem = document.createElement("button");

  assignHtmlElementProps(elem, props);

  if (text) {
    if (typeof text === "string") elem.textContent = text;
    else {
      const { subject, mapper } = text;
      subject.subscribe((v) => (elem.textContent = mapper(v)));
    }
  }
  return elem;
};

const assignHtmlElementProps = (elem: Element, props: HTMLElementProps) => {
  assignClasses(elem, props);
  assignEvents(elem, props);
  assignAttributes(elem, props);
};

const assignClasses = (elem: Element, props: ClassDefinitions) => {
  if (props.className) elem.classList.add(props.className);
};

const assignEvents = (elem: Element, props: Events) => {
  if (props.onClick) elem.addEventListener("click", props.onClick);
};

const assignAttributes = (elem: Element, props: HTMLElementProps) => {
  if (props.id) elem.id = props.id;
};

type Subject<T> = {
  subscribe: (cb: Action<T>) => () => void;
};

type Sub<T1, T2> = {
  subject: Subject<T1>;
  mapper: Func1<T1, T2>;
};

export const bind = <T1, T2>(
  subject: Subject<T1>,
  mapper: Func1<T1, T2>
): Sub<T1, T2> => ({ subject, mapper });
