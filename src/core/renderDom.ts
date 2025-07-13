import Block, { PropsBlock } from "./block";

export default function renderDOM<P extends PropsBlock>(block: Block<P>) {
  const root = document.querySelector("#app");

  if (root) {
    root.innerHTML = "";
    root.appendChild(block.getContent());
  } else {
    console.error("Root element not found");
  }
}

export function render<P extends PropsBlock>(query: string, block: Block<P>) {
  const root = document.querySelector(query);

  if (root) {
    root.appendChild(block.getContent());
    block.dispatchComponentDidMount();
  } else {
    console.error(`Element not found for query: ${query}`);
  }

  return root;
}
