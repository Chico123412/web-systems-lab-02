import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "./styles/main.scss";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
    throw new Error("Елемент #app не знайдено");
}

const container = document.createElement("main");
container.className = "container py-5";

const title = document.createElement("h1");
title.className = "text-center mb-4";
title.textContent = "Система управління бібліотекою";

const description = document.createElement("p");
description.className = "text-center text-secondary";
description.textContent = "Застосунок успішно запущено через TypeScript і webpack.";

container.append(title, description);
app.append(container);