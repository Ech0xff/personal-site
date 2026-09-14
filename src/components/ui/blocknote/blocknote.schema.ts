import {
  BlockNoteSchema,
  createBlockSpec,
  defaultBlockSpecs,
} from "@blocknote/core";
import { ColumnBlock } from "@blocknote/xl-multi-column";
import * as stylex from "@stylexjs/stylex";

import {
  linkCardConfig,
  mediaRowConfig,
  type LinkCardProps,
} from "#lib/shared/content/blocknote.schema";
import { columnLayoutBlock } from "#lib/shared/content/column-layout.extension";

import { cardStyles } from "./link-card.style";
export {
  type CmsBlock,
  type CmsEditor,
  linkCardConfig,
  type LinkCardProps,
  mediaRowConfig,
} from "#lib/shared/content/blocknote.schema";
function styled(tag: string, className?: string) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  return element;
}
export function renderLinkCard(props: LinkCardProps) {
  const card = document.createElement("a");
  card.className = stylex.props(cardStyles.card).className ?? "";
  card.setAttribute("data-cms-link-card", "");
  card.href = props.url;
  card.target = "_blank";
  card.rel = "noopener noreferrer";
  const host = props.url ? new URL(props.url).hostname : "Link card";
  const copy = styled("span", stylex.props(cardStyles.copy).className);
  const source = styled("span", stylex.props(cardStyles.source).className);
  if (props.icon) {
    const icon = document.createElement("img");
    icon.src = props.icon;
    icon.alt = "";
    icon.loading = "lazy";
    icon.className = stylex.props(cardStyles.logo).className ?? "";
    source.append(icon);
  }
  const site = styled("span", stylex.props(cardStyles.site).className);
  site.textContent = props.siteName || host;
  source.append(site);
  const indicator = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg",
  );
  indicator.setAttribute("width", "12");
  indicator.setAttribute("height", "12");
  indicator.setAttribute("viewBox", "0 0 24 24");
  indicator.setAttribute("fill", "none");
  indicator.setAttribute("stroke", "currentColor");
  indicator.setAttribute("stroke-width", "2");
  indicator.setAttribute("aria-hidden", "true");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M15 3h6v6M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5",
  );
  indicator.append(path);
  source.append(indicator);
  copy.append(source);
  const title = styled("span", stylex.props(cardStyles.title).className);
  title.textContent = props.title || host;
  copy.append(title);
  if (props.description) {
    const description = styled(
      "span",
      stylex.props(cardStyles.description).className,
    );
    description.textContent = props.description;
    copy.append(description);
  }
  const domain = styled("span", stylex.props(cardStyles.domain).className);
  domain.textContent = host;
  copy.append(domain);
  card.append(copy);
  if (props.image) {
    const image = document.createElement("img");
    image.setAttribute("data-cms-card-image", "");
    image.src = props.image;
    image.alt = "";
    image.loading = "lazy";
    image.className = stylex.props(cardStyles.image).className ?? "";
    card.append(image);
  }
  return { dom: card };
}
const linkCard = createBlockSpec(linkCardConfig, {
  render: (block) => renderLinkCard(block.props),
  toExternalHTML: (block) => renderLinkCard(block.props),
})();
const mediaRow = createBlockSpec(mediaRowConfig, {
  render: () => ({ dom: document.createElement("span") }),
  toExternalHTML: () => ({ dom: document.createElement("span") }),
})();
export const cmsSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    linkCard,
    mediaRow,
    column: ColumnBlock,
    columnList: columnLayoutBlock,
  },
});
