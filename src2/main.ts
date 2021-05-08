import { viewPage } from "./page";
import * as firebase from "./api/firebase";
import { store } from "./domain";

firebase.initFirebase(() => {
  firebase.loadUserSettings("nLHkgavG6YXJWlP4YkzJ9t4zW692").then((state) => {
    const res: Items = JSON.parse(state.itemsSerialized);
    console.log(res);
    store.setItems(res);
  });
});
document.body.appendChild(viewPage());
