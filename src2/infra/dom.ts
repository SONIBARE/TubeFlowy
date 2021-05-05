import { ClassName } from "./index";
import * as obs from "./observable";

export type ClassMap<T> = Partial<Record<ClassName, T>>;

type ClassDefinitions = {
  className?: ClassName;
  classMap?:
    | ClassMap<boolean | obs.ReadonlySource<boolean>>
    | obs.ReadonlySource<ClassMap<boolean>>;
};

type Events = {
  onClick?: () => void;
};

type ElementProps = {
  id?: string;
};

type HTMLElementProps = ClassDefinitions & Events & ElementProps;

type DivProps = HTMLElementProps;

export const div = (props: DivProps): HTMLDivElement => {
  const elem = (document.createElement("div") as unknown) as DisposableElement;

  assignHtmlElementProps(elem, props);

  return (elem as unknown) as HTMLDivElement;
};

type ButtonProps = HTMLElementProps & {
  //TODO: this any is ugly, but I don't know any way to type this.
  //creating 100500 generic parameters for ButtonProps for each prop is not an option
  text?: string | obs.ReadonlySource<string>;
};
export const button = (props: ButtonProps): HTMLElement => {
  const elem = document.createElement("button", {
    is: "disposable-button",
  }) as DisposableButton;

  assignHtmlElementProps(elem, props);

  if (props.text) {
    if (typeof props.text === "string") elem.textContent = props.text;
    else bindToTextContent(elem, props.text);
  }
  return elem;
};

class DisposableButton extends HTMLButtonElement {
  readonly onDisconnected: Action<void>[] = [];
  disconnectedCallback() {
    this.onDisconnected.forEach((c) => c());
  }
}
customElements.define("disposable-button", DisposableButton, {
  extends: "button",
});

const assignHtmlElementProps = (
  elem: DisposableElement,
  props: HTMLElementProps
) => {
  assignClasses(elem, props);
  assignEvents(elem, props);
  assignAttributes(elem, props);
};

const assignClasses = (elem: DisposableElement, props: ClassDefinitions) => {
  const { className, classMap } = props;
  if (className) elem.classList.add(className);

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

const assignEvents = (elem: Element, props: Events) => {
  if (props.onClick) elem.addEventListener("click", props.onClick);
};

const assignAttributes = (elem: Element, props: HTMLElementProps) => {
  if (props.id) elem.id = props.id;
};

export const bindTo = <T, T2>(
  source: obs.Source<T>,
  mapper: Func1<T, T2>
): obs.ReadonlySource<T2> => obs.mapSource(source, mapper);

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
