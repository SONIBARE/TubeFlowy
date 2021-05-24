import "./normalize";
import * as firebase from "./api/firebase";
import { initThemes } from "./designSystem/colors";
import { App } from "./app/App";

initThemes();
const app = new App();

firebase.initFirebase(() => {
  firebase.loadUserSettings("nLHkgavG6YXJWlP4YkzJ9t4zW692").then((state) => {
    const res: Items = JSON.parse(state.itemsSerialized);
    app.itemsLoaded(res);
  });
});

document.body.appendChild(app.container);
