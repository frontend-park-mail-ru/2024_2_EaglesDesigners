export const debounce = function debounced(callee : Function, timeoutMs : number) {
    return function perform(...args) {
      const previousCall = this.lastCall;
  
      this.lastCall = Date.now();
  
      if (previousCall && this.lastCall - previousCall <= timeoutMs) {
        clearTimeout(this.lastCallTimer);
      }
  
      this.lastCallTimer = setTimeout(() => callee(...args), timeoutMs);
    };
  }