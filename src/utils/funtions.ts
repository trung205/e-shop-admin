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

export const formatDate = (date: any) => {
    return new Date(date)
      .toLocaleString("vi", {
        dateStyle: "short",
        timeStyle: "medium",
        timeZone: "Asia/Ho_Chi_Minh",
      })
      .split(" ")
      .reverse()
      .join(" ");
  };