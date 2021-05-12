import "./normalize";
import { Controller } from "./app/controller";

const controller = new Controller();
document.body.appendChild(controller.view());
