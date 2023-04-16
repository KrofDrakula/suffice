import Prism from "prismjs";

const ta = document.body.querySelector("textarea")! as HTMLTextAreaElement;
const styled = document.body.querySelector("#code")! as HTMLDivElement;

ta.addEventListener("input", (ev) => {
  const text = (ev.target as HTMLTextAreaElement).value;
  styled.textContent = text;
  Prism.highlightElement(styled);
});

styled.textContent = ta.value;
