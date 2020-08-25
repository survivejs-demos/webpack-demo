import ReactDOM from "react-dom";
import React from "react";
import Header from "mf/header";
import "./main.css";

function App() {
  const options = ["Hello world", "Hello federation", "Hello webpack"];
  const [content, setContent] = React.useState(
    "The content should change based on what's clicked."
  );

  return (
    <main className="max-w-md mx-auto space-y-8">
      <Header />
      <aside>
        <ul className="flex space-x-8">
          {options.map((option) => (
            <li key={option}>
              <button
                className="rounded bg-blue-500 text-white p-2"
                onClick={() => setContent(option)}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <article>{content}</article>
    </main>
  );
}

const container = document.createElement("div");
document.body.appendChild(container);
ReactDOM.render(<App />, container);
