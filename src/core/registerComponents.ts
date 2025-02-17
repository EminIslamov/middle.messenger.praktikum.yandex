import Block from "./block";
import Handlebars, { HelperOptions } from "handlebars";

interface BlockConstructable<P = PropsBlock> {
  new (props: P): Block;
}

interface PropsBlock {
  id: string;
  [key: string]: unknown;
}

export default function registerComponent<Props extends PropsBlock>(
  Component: BlockConstructable<Props>,
) {
  Handlebars.registerHelper(
    Component.name,
    function (
      this: Props,
      { hash: { ref, ...hash }, data, fn }: HelperOptions,
    ) {
      if (!data.root.children) {
        data.root.children = {};
      }

      if (!data.root.refs) {
        data.root.refs = {};
      }

      const { children, refs } = data.root;

      /**
       * Костыль для того, чтобы передавать переменные
       * внутрь блоков вручную подменяя значение
       */
      (Object.keys(hash) as string[]).forEach((key: string) => {
        if (this[key] && typeof this[key] === "string") {
          hash[key] = hash[key].replace(
            new RegExp(`{{${String(key)}}}`, "i"),
            this[key] as string,
          );
        }
      });

      const component = new Component(hash);

      children[component.id] = component;

      if (ref) {
        refs[ref] = component.getContent();
      }

      const contents = fn ? fn(this) : "";

      return `<div data-id="${component.id}">${contents}</div>`;
    },
  );
}
