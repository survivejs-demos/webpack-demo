import "regenerator-runtime/runtime";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const App = () => {
  const [language, setLanguage] = useState("en");
  const [hello, setHello] = useState("");
  const changeLanguage = () => setLanguage(language === "en" ? "fi" : "en");

  useEffect(() => {
    translate(language, "hello").then(setHello).catch(console.error);
  }, [language]);

  return (
    <div>
      <button onClick={changeLanguage}>Change language</button>
      <div>{hello}</div>
    </div>
  );
};

function translate(locale, text) {
  return getLocaleData(locale).then((messages) => messages[text]);
}

async function getLocaleData(locale) {
  return import(`../messages/${locale}.json`);
}

const root = document.createElement("div");
root.setAttribute("id", "app");
document.body.appendChild(root);
ReactDOM.render(<App />, root);
