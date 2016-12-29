export default function () {
  const element = document.createElement('h1');

  element.className = 'pure-button';
  element.innerHTML = 'Hello world';
  element.onclick = () => {
    import('./lazy').then((lazy) => {
      element.textContent = lazy.default;
    }).catch((err) => {
      console.error(err);
    });
  };

  return element;
}