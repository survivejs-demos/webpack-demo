module.exports = function () {
  var element = document.createElement('h1');

  element.className = 'pure-button';
  element.innerHTML = 'Hello world';

  return element;
};