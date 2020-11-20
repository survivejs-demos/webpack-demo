import "!demo-loader?name=foo!./main.css";

export default (text = HELLO) => {
  const element = document.createElement("h1");
  const worker = new Worker(new URL("./worker.js", import.meta.url));
  const state = { text };

  worker.addEventListener("message", ({ data: { text } }) => {
    state.text = text;
    element.innerHTML = text;
  });

  element.innerHTML = state.text;
  element.onclick = () => worker.postMessage({ text: state.text });

  return element;
};
