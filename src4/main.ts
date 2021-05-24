import App from "./app/App";
import "../src3/normalize";
import { buildItems } from "../src2/tests/testDataBuilder";
import { initThemes } from "./designSystem/colors";

initThemes();

const app = new App();

const items = buildItems(`
HOME
  folder1
    subfolder1
    subfolder2
    subfolder3
    subfolder4
  folder2
`);

document.body.appendChild(app.el);

app.itemsLoaded(items);
