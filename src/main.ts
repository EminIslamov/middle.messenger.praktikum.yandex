import Handlebars from "handlebars";
import * as Components from "./components";
import * as Pages from "./pages";

import renderDOM from "./core/renderDom";

const pages = {
    login: [Pages.LoginPage],
    account: [Pages.AccountPage, {
        email: 'leocherep@mail.ru',
        login: 'turtle',
        name: 'Леонардо',
        surname: 'Черепахов',
        nickname: 'Лео',
        phone: '8-800-555-35-35',
        isEditing: true,
    }],
    nav: [Pages.NavigatePage],
    signUp: [Pages.SignUpPage],
};

Object.entries(Components).forEach(([name, template]) => {
    if (typeof template === "function") {
        return;
    }
    Handlebars.registerPartial(name, template);
});

function navigate(page: string) {
    //@ts-ignore
    const [source, context] = pages[page];
    if (typeof source === "function") {
        renderDOM(new source({}));
        return;
    }

    const container = document.getElementById("app")!;

    const temlpatingFunction = Handlebars.compile(source);
    container.innerHTML = temlpatingFunction(context);
}

document.addEventListener("DOMContentLoaded", () => navigate("nav"));

document.addEventListener("click", (e) => {
    //@ts-ignore
    const page = e.target.getAttribute("page");
    if (page) {
        navigate(page);

        e.preventDefault();
        e.stopImmediatePropagation();
    }
});