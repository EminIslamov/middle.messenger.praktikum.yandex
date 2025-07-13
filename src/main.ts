import Handlebars from "handlebars";
import { Router } from "./core/router";
import { ChatsPage } from "./pages/chats";
import { LoginPage } from "./pages/login";
// import { LoginPageProps } from "./pages/login/login";
import { AccountPage } from "./pages/account";
import { SignUpPage } from "./pages/sign-up";
import { Error404Page } from "./pages/error404";

import * as Components from "./components";

const router = new Router("#app");


router.use("/", LoginPage, { isPublicOnly: true });
router.use("/sign-up", SignUpPage, { isPublicOnly: true });
router.use("/messenger", ChatsPage, { isPrivate: true });
router.use("/messenger/:id", ChatsPage, { isPrivate: true });
router.use("/settings", AccountPage, { isPrivate: true });
router.use("/404", Error404Page);

router.start();

Object.entries(Components).forEach(([name, template]) => {
  if (typeof template === "function") {
    return;
  }
  Handlebars.registerPartial(name, template);
});

