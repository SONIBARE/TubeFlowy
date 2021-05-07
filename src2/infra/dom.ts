import {
  disposableButton,
  disposableDiv,
  disposableSpan,
} from "./disposableElements";
import { ClassName } from "./index";
import * as obs from "./observable";

export type ClassMap<T> = Partial<Record<ClassName, T>>;

//used in SVG (svg can't observe values)
export type ReadonlyClassDefinitions = {
  className?: ClassName;
  classNames?: ClassName[];
  classMap?: ClassMap<boolean>;
};
type ClassDefinitions = {
  className?: ClassName;
  classNames?: ClassName[];
  classMap?:
    | ClassMap<boolean | obs.ReadonlySource<boolean>>
    | obs.ReadonlySource<ClassMap<boolean>>;
};

export type Events = {
  onClick?: () => void;
};

type ElementProps = {
  id?: string;
};

type HTMLElementProps = ClassDefinitions & Events & ElementProps;

type ElementWithChildren = {
  children?: (Element | string)[];
};

type DivProps = HTMLElementProps & ElementWithChildren;

export const div = (props: DivProps): HTMLDivElement => {
  const elem = disposableDiv();

  assignHtmlElementProps(elem, props);

  if (props.children) {
    props.children.forEach((child) => {
      if (typeof child === "string") elem.append(child);
      else elem.appendChild(child);
    });
  }
  return elem;
};

type SpanProps = HTMLElementProps & { text: string };

export const span = (props: SpanProps): HTMLSpanElement => {
  const elem = disposableSpan();

  assignHtmlElementProps(elem, props);

  elem.append(props.text);
  return elem;
};

type ButtonProps = HTMLElementProps & {
  text?: string | obs.ReadonlySource<string>;
};
export const button = (props: ButtonProps): HTMLElement => {
  const elem = disposableButton();

  assignHtmlElementProps(elem, props);

  if (props.text) {
    if (typeof props.text === "string") elem.textContent = props.text;
    else bindToTextContent(elem, props.text);
  }
  return elem;
};
const assignHtmlElementProps = (
  elem: DisposableElement,
  props: HTMLElementProps
) => {
  assignClasses(elem, props);
  assignEvents(elem, props);
  assignAttributes(elem, props);
};

export const assignClasses = (
  elem: DisposableElement,
  props: ClassDefinitions
) => {
  const { className, classNames, classMap } = props;
  if (className) elem.classList.add(className);
  if (classNames) classNames.forEach((c) => elem.classList.add(c));

  if (classMap) {
    if (isBindingDefinition(classMap)) {
      bindToClassMap(elem, classMap);
    } else {
      Object.entries(classMap).forEach(([classKey, isSet]) => {
        if (typeof isSet === "boolean") {
          updateClass(elem, classKey as ClassName, isSet);
        } else if (isSet) {
          bindToClassName(elem, isSet, classKey as ClassName);
        }
      });
    }
  }
};

export const assignReadonlyClasses = (
  elem: Element,
  props: ReadonlyClassDefinitions
) => {
  const { className, classNames, classMap } = props;
  if (className) elem.classList.add(className);
  if (classNames) classNames.forEach((c) => elem.classList.add(c));
  if (classMap)
    Object.entries(classMap).forEach(
      ([classKey, isSet]) =>
        isSet && updateClass(elem, classKey as ClassName, isSet)
    );
};

export const updateClass = (elem: Element, c: ClassName, isSet: boolean) => {
  if (isSet) elem.classList.add(c);
  else elem.classList.remove(c);
};

export const setClassMap = (elem: Element, classDef: ClassMap<boolean>) => {
  Object.entries(classDef).forEach(([className, isSet]) => {
    if (isSet) elem.classList.add(className);
    else elem.classList.remove(className);
  });
};

export const assignEvents = <T extends Element>(elem: T, props: Events): T => {
  if (props.onClick) elem.addEventListener("click", props.onClick);
  return elem;
};

const assignAttributes = (elem: Element, props: HTMLElementProps) => {
  if (props.id) elem.id = props.id;
};

export const bindToMap = <T, T2>(
  source: obs.Source<T>,
  mapper: Func1<T, T2>
): obs.ReadonlySource<T2> => obs.mapSource(source, mapper);

export const bindTo = <T>(source: obs.Source<T>): obs.ReadonlySource<T> =>
  source;

type DisposableElement = Element & {
  onDisconnected: Action<void>[];
};
const bindToTextContent = (
  elem: DisposableElement,
  binding: obs.ReadonlySource<string>
) => {
  elem.onDisconnected.push(binding.bind((v) => (elem.textContent = v)));
};

const bindToClassName = (
  elem: DisposableElement,
  binding: obs.ReadonlySource<boolean>,
  className: ClassName
) => {
  elem.onDisconnected.push(
    binding.bind((v) => updateClass(elem, className, v))
  );
};

const bindToClassMap = (
  elem: DisposableElement,
  binding: obs.ReadonlySource<ClassMap<boolean>>
) => {
  elem.onDisconnected.push(binding.bind((v) => setClassMap(elem, v)));
};

const isBindingDefinition = <T>(val: {}): val is obs.ReadonlySource<T> => {
  return "bind" in val;
};
