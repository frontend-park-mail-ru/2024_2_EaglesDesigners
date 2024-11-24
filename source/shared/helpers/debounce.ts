export const debounce = function debounced(callee : Function, timeoutMs : number) {
    return function perform(...args) {
      clearTimeout(this.lastCallTimer);
  
      this.lastCallTimer = setTimeout(() => callee(...args), timeoutMs);
    };
  }