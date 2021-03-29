import { css, span, fragment, div, anim } from "../infra";
import { EventsHandler } from "../domain/eventHandler";

//DOM
const li = (children: (HTMLElement | string | undefined)[]): HTMLLIElement => {
  const elem = document.createElement("li");
  for (let index = 0; index < children.length; index++) {
    const element = children[index];
    if (typeof element === "string") elem.append(element);
    else if (element) elem.appendChild(element);
  }
  return elem;
};

const ul = (children: HTMLLIElement[]): HTMLUListElement => {
  const elem = document.createElement("ul");
  elem.appendChild(fragment(children));
  return elem;
};

//DOMAIN

//State
const selected: any = {};

const getSelectedCount = () => Object.keys(selected).length;

const isItemSelected = (itemName: string): boolean => !!selected[itemName];

const onItemClicked = (itemName: string) => {
  if (selected[itemName]) delete selected[itemName];
  else {
    selected[itemName] = true;
  }
  events.dispatchCompundEvent("my-item-selected", itemName, itemName);
};

//Events
type TypeDefinitions = {
  "my-item-selected": string;
};
const events = new EventsHandler<TypeDefinitions>();

//VIEW
const summaryLabel = (): HTMLElement => {
  const summary = div({});
  summary.append("Selected: ");
  const counter = span({ className: "bold" as any }, "");
  summary.appendChild(counter);

  counter.textContent = getSelectedCount() + "";
  events.addEventListener("my-item-selected", () => {
    counter.textContent = getSelectedCount() + "";
  });
  return summary;
};

const row = (text: string, children?: HTMLElement): HTMLLIElement => {
  const removeButton = document.createElement("button");
  removeButton.textContent = "x";
  removeButton.classList.add("remove-button");
  const elem = span(
    { className: "title" as any, events: { click: () => onItemClicked(text) } },
    text
  );

  events.addCompoundEventListener("my-item-selected", text, () => {
    if (isItemSelected(text)) elem.classList.add("bold");
    else elem.classList.remove("bold");
  });
  return li([elem, removeButton, children]);
};

css.text(`
.bold{
  font-weight: bold;
}

.remove-button{
  margin-left: 10px;
  font-size: 14px;
  padding: 0 4px;
  cursor:pointer;
}

.title:hover{
cursor: pointer;
}




`);

document.body.appendChild(
  ul([
    row(
      "First",
      ul([
        row("First 1.1", ul([row("First 1.1.1"), row("First 1.1.2")])),
        row("First 1.2"),
        row("First 1.3"),
        row("First 1.4"),
        row("First 1.5"),
        row("First 1.6"),
      ])
    ),
    row("Second"),
    row("Third"),
    row(
      "Fourth",
      ul([
        row("Fourth 1.1"),
        row("Fourth 1.2"),
        row("Fourth 1.3"),
        row("Fourth 1.4"),
      ])
    ),
    row("Fifth"),
    row("Six"),
    row("Seven"),
  ])
);

document.body.appendChild(summaryLabel());
