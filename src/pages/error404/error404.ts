import Block from "../../core/block.ts";
import { Error } from "../../components/error/error.ts";

export default class Error404Page extends Block {
    constructor() {
            super("div", {
              ErrorComponent: new Error({
                  errorCode: '404',
                  errorMessage: 'Не туда попали"'
              })
        })
    }
        public render(): string {
            return `
              {{{ ErrorComponent }}}
             `;
        }
}

