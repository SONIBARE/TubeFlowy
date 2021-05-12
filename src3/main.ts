import "./normalize";
import { Controller } from "./app/controller";
import * as firebase from "./api/firebase";

// firebase.initFirebase(() => {
//   firebase.loadUserSettings("nLHkgavG6YXJWlP4YkzJ9t4zW692").then((state) => {
//     const res: Items = JSON.parse(state.itemsSerialized);
//     console.log(res);
//   });
// });
const controller = new Controller();
document.body.appendChild(controller.view());
