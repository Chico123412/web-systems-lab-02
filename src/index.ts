import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "./styles/main.scss";

import { LibraryManager } from "./services/LibraryManager";
import { renderApp } from "./ui/render";

const app = document.querySelector<HTMLElement>("#app");

if (!app) {
  throw new Error("Елемент #app не знайдено");
}

const libraryManager = new LibraryManager();

renderApp(app, libraryManager);
