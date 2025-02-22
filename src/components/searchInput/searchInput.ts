import Block from "../../core/block";
import SearchIcon from "../../icons/search.svg";

export default class SearchInput extends Block {
  constructor() {
    super("div", {});
  }

  public render(): string {
    return `
            <div class="search_input">
                <img src="${SearchIcon}" alt="search" class="search_input__icon" />
                <input class="search_input__input" type="text" placeholder="Поиск" />
            </div>
        `;
  }
}
