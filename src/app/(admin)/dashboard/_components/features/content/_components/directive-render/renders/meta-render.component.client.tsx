"use client";

import * as stylex from "@stylexjs/stylex";
import { ExternalLink, Globe2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { group } from "#design/interaction.stylex";
import {
  color,
  font,
  space,
  shape,
  shadow,
  motionToken,
} from "#design/tokens.stylex";

import { parseMicrolinkResponse, type MicrolinkData } from "./microlink.schema";
const pulse = stylex.keyframes({
  "50%": {
    opacity: 0.5,
  },
});
const styles = stylex.create({
  label3: {
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
  },
  label13: {
    display: "flex",
    minWidth: "0px",
    flexDirection: "column",
    gap: space.xxs,
    overflow: "hidden",
  },
  state: {
    marginTop: space.md,
    marginBottom: space.md,
    display: "flex",
    height: "128px",
    width: "100%",
    overflow: "hidden",
    borderTopLeftRadius: shape.control,
    borderTopRightRadius: shape.control,
    borderBottomRightRadius: shape.control,
    borderBottomLeftRadius: shape.control,
    borderTopWidth: shape.fine,
    borderRightWidth: shape.fine,
    borderBottomWidth: shape.fine,
    borderLeftWidth: shape.fine,
    borderTopStyle: "solid",
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
    borderLeftStyle: "solid",
    borderTopColor: color.line,
    borderRightColor: color.line,
    borderBottomColor: color.line,
    borderLeftColor: color.line,
    backgroundColor: color.surface,
    textDecorationLine: "none",
    boxShadow: shadow.subtle,
    transitionProperty:
      "color, background-color, border-color, text-decoration-color",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
  },
  state2: {
    borderTopColor: {
      default: null,
      ":hover": color.borderStrong,
    },
    borderRightColor: {
      default: null,
      ":hover": color.borderStrong,
    },
    borderBottomColor: {
      default: null,
      ":hover": color.borderStrong,
    },
    borderLeftColor: {
      default: null,
      ":hover": color.borderStrong,
    },
    backgroundColor: {
      default: null,
      ":hover": color.surfaceMuted,
    },
  },
  state3: {
    outlineStyle: {
      default: null,
      ":focus-visible": "none",
    },
    outlineWidth: {
      default: null,
      ":focus-visible": "2px",
    },
    outlineColor: {
      default: null,
      ":focus-visible": `color-mix(in srgb, ${color.infoBorder} 40%, transparent)`,
    },
  },
  label: {
    display: "flex",
    minHeight: "0px",
    minWidth: "0px",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    flexDirection: "column",
    justifyContent: "space-between",
    paddingTop: space.md,
    paddingRight: space.md,
    paddingBottom: space.md,
    paddingLeft: space.md,
  },
  label2: {
    display: "block",
    height: space.md,
    width: "66.66666666666667%",
    animationName: pulse,
    animationDuration: "2s",
    animationTimingFunction: "ease-in-out",
    animationIterationCount: "infinite",
    borderTopLeftRadius: shape.small,
    borderTopRightRadius: shape.small,
    borderBottomRightRadius: shape.small,
    borderBottomLeftRadius: shape.small,
    backgroundColor: color.surfaceStrong,
  },
  label4: {
    display: "block",
    height: space.sm,
    width: "100%",
    animationName: pulse,
    animationDuration: "2s",
    animationTimingFunction: "ease-in-out",
    animationIterationCount: "infinite",
    borderTopLeftRadius: shape.small,
    borderTopRightRadius: shape.small,
    borderBottomRightRadius: shape.small,
    borderBottomLeftRadius: shape.small,
    backgroundColor: color.surfaceMuted,
  },
  label5: {
    display: "block",
    height: space.sm,
    width: "80%",
    animationName: pulse,
    animationDuration: "2s",
    animationTimingFunction: "ease-in-out",
    animationIterationCount: "infinite",
    borderTopLeftRadius: shape.small,
    borderTopRightRadius: shape.small,
    borderBottomRightRadius: shape.small,
    borderBottomLeftRadius: shape.small,
    backgroundColor: color.surfaceMuted,
  },
  label6: {
    display: "block",
    height: space.sm,
    width: "128px",
    animationName: pulse,
    animationDuration: "2s",
    animationTimingFunction: "ease-in-out",
    animationIterationCount: "infinite",
    borderTopLeftRadius: shape.small,
    borderTopRightRadius: shape.small,
    borderBottomRightRadius: shape.small,
    borderBottomLeftRadius: shape.small,
    backgroundColor: color.surfaceMuted,
  },
  label7: {
    display: "flex",
    height: "20px",
    width: "20px",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  globe2: {
    height: space.md,
    width: space.md,
  },
  label8: {
    minWidth: "0px",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    fontSize: font.control,
    lineHeight: 1.5,
  },
  externalLink: {
    height: space.md,
    width: space.md,
    flexShrink: 0,
  },
  label9: {
    display: "flex",
    minHeight: "0px",
    minWidth: "0px",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: space.xs,
    paddingTop: space.md,
    paddingRight: space.md,
    paddingBottom: space.md,
    paddingLeft: space.md,
  },
  label10: {
    display: "flex",
    minWidth: "0px",
    alignItems: "center",
    gap: space.xs,
    fontSize: font.small,
    lineHeight: 1,
    fontWeight: font.medium,
    color: color.muted,
  },
  label11: {
    display: "flex",
    height: "20px",
    width: "20px",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderTopLeftRadius: shape.small,
    borderTopRightRadius: shape.small,
    borderBottomRightRadius: shape.small,
    borderBottomLeftRadius: shape.small,
    backgroundColor: color.surfaceMuted,
    color: color.muted,
  },
  image: {
    marginTop: "0px",
    marginRight: "0px",
    marginBottom: "0px",
    marginLeft: "0px",
    height: space.md,
    width: space.md,
    objectFit: "contain",
  },
  label12: {
    minWidth: "0px",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  externalLink2: {
    height: "14px",
    width: "14px",
    flexShrink: 0,
    opacity: {
      default: 0.65,
      [stylex.when.ancestor(":focus-within", group)]: 1,
      [stylex.when.ancestor(":hover", group)]: 1,
    },
    transitionProperty: "opacity",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
  },
  label14: {
    marginTop: "0px",
    marginRight: "0px",
    marginBottom: "0px",
    marginLeft: "0px",
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: font.bodySize,
    lineHeight: 1.375,
    fontWeight: font.semibold,
    color: color.text,
  },
  label15: {
    marginTop: "0px",
    marginRight: "0px",
    marginBottom: "0px",
    marginLeft: "0px",
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: font.control,
    lineHeight: "20px",
    color: color.secondary,
  },
  label16: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: font.small,
    lineHeight: 1,
    color: color.muted,
  },
  label17: {
    position: "relative",
    display: {
      default: "none",
      "@media (min-width: 640px)": "block",
    },
    width: "144px",
    flexShrink: 0,
    borderLeftWidth: shape.fine,
    borderLeftStyle: "solid",
    borderTopColor: color.line,
    borderRightColor: color.line,
    borderBottomColor: color.line,
    borderLeftColor: color.line,
    backgroundColor: color.surfaceMuted,
  },
  image2: {
    marginTop: "0px",
    marginRight: "0px",
    marginBottom: "0px",
    marginLeft: "0px",
    height: "100%",
    width: "100%",
    objectFit: "cover",
  },
  link: {
    marginTop: space.md,
    marginBottom: space.md,
    display: "flex",
    height: "80px",
    width: "100%",
    alignItems: "center",
    gap: space.sm,
    overflow: "hidden",
    borderTopLeftRadius: shape.control,
    borderTopRightRadius: shape.control,
    borderBottomRightRadius: shape.control,
    borderBottomLeftRadius: shape.control,
    borderTopWidth: shape.fine,
    borderRightWidth: shape.fine,
    borderBottomWidth: shape.fine,
    borderLeftWidth: shape.fine,
    borderTopStyle: "solid",
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
    borderLeftStyle: "solid",
    borderTopColor: color.dangerBorder,
    borderRightColor: color.dangerBorder,
    borderBottomColor: color.dangerBorder,
    borderLeftColor: color.dangerBorder,
    backgroundColor: {
      default: `color-mix(in srgb, ${color.dangerSurface} 80%, transparent)`,
      ":hover": color.dangerSurface,
    },
    paddingTop: space.md,
    paddingRight: space.md,
    paddingBottom: space.md,
    paddingLeft: space.md,
    textDecorationLine: "none",
    boxShadow: shadow.subtle,
    color: color.dangerText,
    outlineStyle: {
      default: null,
      ":focus-visible": "none",
    },
    outlineWidth: {
      default: null,
      ":focus-visible": "2px",
    },
    outlineColor: {
      default: null,
      ":focus-visible": `color-mix(in srgb, ${color.dangerBorder} 40%, transparent)`,
    },
  },
});
type MetadataState =
  | {
      status: "loading";
    }
  | {
      status: "success";
      metadata: MicrolinkData;
    }
  | {
      status: "error";
      message: string;
    };
interface Props {
  url: string;
}
const cardStyles = [styles.state, styles.state2, styles.state3, null, null];
const resolveHost = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};
function MetaSkeleton({ url }: { url: string }) {
  return (
    <a
      {...stylex.props(cardStyles)}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${resolveHost(url)}`}
    >
      <span {...stylex.props(styles.label)}>
        <span {...stylex.props(styles.label2)} />
        <span {...stylex.props(styles.label3)}>
          <span {...stylex.props(styles.label4)} />
          <span {...stylex.props(styles.label5)} />
        </span>
        <span {...stylex.props(styles.label6)} />
      </span>
    </a>
  );
}
function MetaError({ message, url }: { message: string; url: string }) {
  return (
    <a
      {...stylex.props([styles.link, null])}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span {...stylex.props(styles.label7)}>
        <Globe2 {...stylex.props(styles.globe2)} aria-hidden="true" />
      </span>
      <span {...stylex.props(styles.label8)}>{message}</span>
      <ExternalLink {...stylex.props(styles.externalLink)} aria-hidden="true" />
    </a>
  );
}
function MetaContent({
  metadata,
  url,
}: {
  metadata: MicrolinkData;
  url: string;
}) {
  const href = metadata.url || url;
  const hostname = resolveHost(href);
  const imageUrl = metadata.image?.url;
  const logoUrl = metadata.logo?.url;
  const cardTitle = metadata.title || hostname;
  return (
    <a
      {...stylex.props([cardStyles, group])}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span {...stylex.props(styles.label9)}>
        <span {...stylex.props(styles.label10)}>
          <span {...stylex.props(styles.label11)}>
            {logoUrl ? (
              <Image
                {...stylex.props(styles.image)}
                src={logoUrl}
                alt=""
                width={16}
                height={16}
                loading="lazy"
                unoptimized
              />
            ) : (
              <Globe2 {...stylex.props(styles.globe2)} aria-hidden="true" />
            )}
          </span>
          <span {...stylex.props(styles.label12)}>
            {metadata.publisher || hostname}
          </span>
          <ExternalLink
            {...stylex.props(styles.externalLink2)}
            aria-hidden="true"
          />
        </span>
        <span {...stylex.props(styles.label13)}>
          <span {...stylex.props(styles.label14)}>{cardTitle}</span>
          {metadata.description ? (
            <span {...stylex.props(styles.label15)}>
              {metadata.description}
            </span>
          ) : null}
        </span>
        <span {...stylex.props(styles.label16)}>{hostname}</span>
      </span>
      {imageUrl ? (
        <span {...stylex.props(styles.label17)}>
          <Image
            {...stylex.props(styles.image2)}
            src={imageUrl}
            alt=""
            fill
            loading="lazy"
            sizes="144px"
            unoptimized
          />
        </span>
      ) : null}
    </a>
  );
}
export default function MetaRenderClient({ url }: Props) {
  const [state, setState] = useState<MetadataState>({
    status: "loading",
  });
  const metadataUrl = useMemo(() => {
    const endpoint = new URL("https://api.microlink.io/");
    endpoint.searchParams.set("url", url);
    return endpoint.toString();
  }, [url]);
  useEffect(() => {
    const controller = new AbortController();
    setState({
      status: "loading",
    });
    fetch(metadataUrl, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to load link metadata.");
        }
        const payload = parseMicrolinkResponse(await response.json());
        if (payload.status !== "success" || !payload.data) {
          throw new Error(payload.message || "Failed to load link metadata.");
        }
        setState({
          status: "success",
          metadata: payload.data,
        });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setState({
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "Failed to load link metadata.",
        });
      });
    return () => controller.abort();
  }, [metadataUrl]);
  if (state.status === "loading") return <MetaSkeleton url={url} />;
  if (state.status === "error") {
    return <MetaError message={state.message} url={url} />;
  }
  return <MetaContent metadata={state.metadata} url={url} />;
}
