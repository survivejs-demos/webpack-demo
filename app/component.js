const component = function () {
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
};

const treeShakingDemo = function () {
  return 'this should get shaked out';
};

export {
  component,
  treeShakingDemo,
};
