import { ClassName } from "./index";
import * as obs from "./observable";

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

export const div = (props: DivProps): HTMLElement => {
  const elem = document.createElement("div");

  assignHtmlElementProps(elem, props);

  return elem;
};

type ButtonProps = HTMLElementProps & {
  //TODO: this any is ugly, but I don't know any way to type this.
  //creating 100500 generic parameters for ButtonProps for each prop is not an option
  text?: string | BindDefinition<any, string>;
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

type BindDefinition<T, T2> = {
  source: obs.Source<T>;
  mapper: Func1<T, T2>;
};
export const bindTo = <T, T2>(
  source: obs.Source<T>,
  mapper: Func1<T, T2>
): BindDefinition<T, T2> => ({ source, mapper });

class DisposableButton extends HTMLButtonElement {
  onDisconnected?: Action<void>;
  disconnectedCallback() {
    if (this.onDisconnected) this.onDisconnected();
  }
}
customElements.define("disposable-button", DisposableButton, {
  extends: "button",
});

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

type DisposableElement = {
  onDisconnected?: Action<void>;
};
const bindToTextContent = (
  elem: Element & DisposableElement,
  binding: BindDefinition<{}, string>
) => {
  const { source, mapper } = binding;
  elem.onDisconnected = source.bind((v) => (elem.textContent = mapper(v)));
};
