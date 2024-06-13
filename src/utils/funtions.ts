export function debounce(fn: any, time = 500) {
    let timeoutId: any;
    function wrapper(...args: any[]) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        timeoutId = null;
        fn(...args);
      }, time);
    }
    return wrapper;
  }