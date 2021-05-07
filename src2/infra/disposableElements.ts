//This is the only nice way to handle elements being removed from DOM
//I've tried to use MutationObserver API, but it has a huge performance drawback
//since it checks DOM on each state change.

//I'm implying CustomElements API handles node removal much more efficiently.
//And I'm planning NOT to use disposable elements for each element by default,
//nly when I'm subscribing to a store events (binding to sources)

//
//Button
//
class DisposableButton extends HTMLButtonElement {
  readonly onDisconnected: Action<void>[] = [];
  disconnectedCallback() {
    this.onDisconnected.forEach((c) => c());
  }
}
customElements.define("disposable-button", DisposableButton, {
  extends: "button",
});

export const disposableButton = (): DisposableButton =>
  document.createElement("button", {
    is: "disposable-button",
  }) as DisposableButton;

//
//Div
//
class DisposableDiv extends HTMLDivElement {
  readonly onDisconnected: Action<void>[] = [];
  disconnectedCallback() {
    this.onDisconnected.forEach((c) => c());
  }
}
customElements.define("disposable-div", DisposableDiv, {
  extends: "div",
});

export const disposableDiv = (): DisposableDiv =>
  document.createElement("div", {
    is: "disposable-div",
  }) as DisposableDiv;

//
//Span
//
class DisposableSpan extends HTMLSpanElement {
  readonly onDisconnected: Action<void>[] = [];
  disconnectedCallback() {
    this.onDisconnected.forEach((c) => c());
  }
}
customElements.define("disposable-span", DisposableSpan, {
  extends: "span",
});
export const disposableSpan = (): DisposableSpan =>
  document.createElement("span", {
    is: "disposable-span",
  }) as DisposableDiv;
