// Theme initialization script injected before paint to avoid FOUC.
const themeInit = () => {
  const isHomePath = (path: string) => /^\/(?:en|zh-CN)?\/?$/.test(path);

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
  document.documentElement.dataset.home = isHomePath(window.location.pathname)
    ? "true"
    : "false";
};

export const themeInitScript = `(${themeInit.toString()})();`;
  