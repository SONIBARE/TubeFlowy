import "./normalize";
import { Controller } from "./app/controller";
import * as firebase from "./api/firebase";

const controller = new Controller();

firebase.initFirebase(() => {
  firebase.loadUserSettings("nLHkgavG6YXJWlP4YkzJ9t4zW692").then((state) => {
    const res: Items = JSON.parse(state.itemsSerialized);
    controller.itemsLoaded(res);
  });
});
document.body.appendChild(controller.view());
