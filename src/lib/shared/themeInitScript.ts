// Theme initialization script injected before paint to avoid FOUC.
const themeInit = () => {
  (() => {
    const cookies = document.cookie.split("; ");
    let theme = "system";
    for (let i = 0; i < cookies.length; i++) {
      const parts = cookies[i].split("=");
      if (parts[0] === "theme") {
        theme = parts[1];
        break;
      }
    }
    document.documentElement.classList.add("group", theme);
  })();

  (() => {
    const updateHomeStatus = () => {
      const isHomePath = /^\/(?:en|zh-CN)?\/?$/.test(window.location.pathname);
      document.documentElement.dataset.home = isHomePath ? "true" : "false";
    };
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      updateHomeStatus();
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      updateHomeStatus();
    };
  })();
};

export const InitScript = `(${themeInit.toString()})();`;
