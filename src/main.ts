import Handlebars from "handlebars";
import * as Components from "./components";
import * as Pages from "./pages";

import renderDOM from "./core/renderDom";

const pages = {
  login: [Pages.LoginPage],
  account: [Pages.AccountPage],
  nav: [Pages.NavigatePage],
  signUp: [Pages.SignUpPage],
  chats: [Pages.ChatsPage],
  error404: [Pages.Error404Page],
};

Object.entries(Components).forEach(([name, template]) => {
  if (typeof template === "function") {
    return;
  }
  Handlebars.registerPartial(name, template);
});

function navigate(page: string) {
  //@ts-expect-error: Времененная мера для текущей навигации
  const [source, context] = pages[page];
  if (typeof source === "function") {
    renderDOM(new source({}));
    return;
  }

  const container = document.getElementById("app");

  if (container) {
    const temlpatingFunction = Handlebars.compile(source);
    container.innerHTML = temlpatingFunction(context);
  } else {
    console.error("Container element not found");
  }
}

document.addEventListener("DOMContentLoaded", () => navigate("nav"));

document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  const page = target.getAttribute("page");
  if (page) {
    navigate(page);

    e.preventDefault();
    e.stopImmediatePropagation();
  }
});
