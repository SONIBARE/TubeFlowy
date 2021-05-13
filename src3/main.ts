import "./normalize";
import { AppController } from "./app/AppController";
import * as firebase from "./api/firebase";
import { initThemes } from "./designSystem/colors";

initThemes();
const controller = new AppController();

firebase.initFirebase(() => {
  firebase.loadUserSettings("nLHkgavG6YXJWlP4YkzJ9t4zW692").then((state) => {
    const res: Items = JSON.parse(state.itemsSerialized);
    controller.itemsLoaded(res);
  });
});
document.body.appendChild(controller.view());
