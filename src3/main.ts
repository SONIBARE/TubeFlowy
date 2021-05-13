import "./normalize";
import * as firebase from "./api/firebase";
import { initThemes } from "./designSystem/colors";
import { AppController } from "./app/AppController";
import { Store } from "./app/Store";

initThemes();
const controller = new AppController(new Store());

firebase.initFirebase(() => {
  firebase.loadUserSettings("nLHkgavG6YXJWlP4YkzJ9t4zW692").then((state) => {
    const res: Items = JSON.parse(state.itemsSerialized);
    controller.itemsLoaded(res);
  });
});

document.body.appendChild(controller.view());
