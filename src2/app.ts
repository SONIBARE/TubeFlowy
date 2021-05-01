import { dom, style, css } from "./infra";

import "./normalize";

let counter = 0;
const bind = () => {
  elem.textContent = counter + "";
};
const elem = dom.div({
  className: "foo",
  onClick: () => {
    counter += 1;
    bind();
  },
});
bind();
document.body.appendChild(elem);

style.selector(".foo", {
  margin: css.margin(60, 20),
  color: "red",
  fontSize: 60,
});
