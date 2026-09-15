/** DOM icons keep the editor node view and cached readonly HTML identical. */
export function createCodeIcon(name: "copy" | "check" | "code" | "diagram") {
  const namespace = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(namespace, "svg");
  for (const [key, value] of Object.entries({
    viewBox: "0 0 24 24",
    width: "16",
    height: "16",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "1.75",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "aria-hidden": "true",
  }))
    svg.setAttribute(key, value);
  const paths = {
    copy: [
      "M9 8H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-2",
      "M11 3h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z",
    ],
    check: ["m5 12 4 4L19 6"],
    code: ["m8 6-6 6 6 6", "m16 6 6 6-6 6", "m14 4-4 16"],
    diagram: ["M3 3h6v6H3z", "M15 15h6v6h-6z", "M6 9v9h9", "M9 6h9v9"],
  };
  for (const d of paths[name]) {
    const path = document.createElementNS(namespace, "path");
    path.setAttribute("d", d);
    svg.append(path);
  }
  return svg;
}
