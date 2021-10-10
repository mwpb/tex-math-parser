import katex from "katex";
import "katex/dist/katex.min.css";
import { parse } from "../../parsers/tex-ast";
// Elements

let container = document.createElement("div");

let latexInput = document.createElement("textarea");
let katexDisplay = document.createElement("div");
let astDisplay = document.createElement("div");
let feedbackDiv = document.createElement("div");

container.appendChild(latexInput);
container.appendChild(katexDisplay);
container.appendChild(astDisplay);
container.appendChild(feedbackDiv);

document.body.appendChild(container);

// Callbacks

latexInput.oninput = () => {
  feedbackDiv.innerHTML = "";
  astDisplay.innerHTML = "";
  latexInput.innerHTML = "";
  
  try {
    katex.render(latexInput.value, katexDisplay, {});
  } catch (e) {
    feedbackDiv.innerHTML = e;
  }

  try {
    let ast = parse(latexInput.value);
    astDisplay.innerHTML = JSON.stringify(ast);
  } catch (e) {
    astDisplay.innerHTML = e;
  }
};
