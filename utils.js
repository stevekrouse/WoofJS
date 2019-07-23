export function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

export function getID() {
  // returns the name of a project, not including the current revision
  return window.location.hash.substring(1, window.location.hash.length).split("/")[0];
}

export function getIDWithRevision() {
  // returns the name of a project, inlcuding the current revision
  return window.location.hash.substring(1, window.location.hash.length);
}

export var currentHash =  window.location.hash