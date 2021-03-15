class MySuperDiv<T> extends HTMLElement {
  props: T | null = null;
  onRemove: (() => void) | undefined;

  connectedCallback() {}

  disconnectedCallback() {
    if (this.onRemove) this.onRemove();
  }
}

customElements.define("my-div", MySuperDiv);

type Component<TProp> = (
  props: TProp,
  elem: HTMLElement
) => void | (() => void);

export const component = <T>(a: Component<T>) => (props: T): HTMLElement => {
  const e = document.createElement("my-div") as MySuperDiv<T>;
  const res = a(props, e);
  if (res) e.onRemove = res;
  return e;
};
