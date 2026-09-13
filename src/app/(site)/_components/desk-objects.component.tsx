import * as stylex from "@stylexjs/stylex";

import { foundation } from "../_design/foundation.style";
import { feedback, objectMarker } from "../_design/object-feedback.stylex";
import {
  color,
  font,
  material,
  media,
  motionToken,
  shadow,
  shape,
} from "../_design/tokens.stylex";
import { DeskLink } from "./desk-navigation.component";

const styles = stylex.create({
  bookFrame: { left: "-40px", top: "-12px", right: "24px", bottom: "-12px" },
  letterFrame: { inset: "-23px" },
  books: {
    width: "214px",
    position: "relative",
    paddingTop: "12px",
    paddingRight: "12px",
    paddingBottom: "28px",
    transform: {
      default: "rotate(5deg)",
      ":hover": "translateY(-5px) rotate(1deg)",
      ":focus-visible": "translateY(-5px) rotate(1deg)",
      [media.reduce]: "rotate(5deg)",
    },
    transitionProperty: "transform",
    transitionDuration: { default: motionToken.slow, [media.reduce]: "0s" },
    transitionTimingFunction: motionToken.ease,
  },
  bookBack: {
    position: "absolute",
    left: "-15px",
    top: "24px",
    width: "175px",
    height: "217px",
    borderTopLeftRadius: "3px",
    borderTopRightRadius: "6px",
    borderBottomRightRadius: "6px",
    borderBottomLeftRadius: "3px",
    backgroundColor: material.bookBack,
    transform: "rotate(-12deg)",
    boxShadow: shadow.contact,
    borderLeftWidth: "8px",
    borderLeftStyle: "solid",
    borderLeftColor: material.bookSpine,
  },
  book: {
    position: "relative",
    width: "175px",
    height: "224px",
    backgroundColor: material.book,
    backgroundImage: material.cloth,
    color: material.bookInk,
    boxShadow: `${shadow.book}, ${shadow.lifted}`,
    borderTopLeftRadius: "3px",
    borderTopRightRadius: "6px",
    borderBottomRightRadius: "6px",
    borderBottomLeftRadius: "3px",
    paddingTop: "24px",
    paddingRight: "24px",
    paddingBottom: "20px",
    paddingLeft: "28px",
    transform: {
      default: "rotate(-3deg)",
      [stylex.when.ancestor(":hover", objectMarker)]:
        "translate(7px, -2px) rotate(1deg)",
      [stylex.when.ancestor(":focus-visible", objectMarker)]:
        "translate(7px, -2px) rotate(1deg)",
      [media.reduce]: "rotate(-3deg)",
    },
    transitionProperty: "transform",
    transitionDuration: { default: motionToken.slow, [media.reduce]: "0s" },
    transitionTimingFunction: motionToken.ease,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderBottomWidth: "6px",
    borderBottomStyle: "double",
    borderBottomColor: `${material.paperEdge}`,
  },
  bookIssue: {
    fontFamily: font.mono,
    fontSize: "7px",
    letterSpacing: "0.13em",
    lineHeight: 1.6,
  },
  bookTitle: {
    fontFamily: font.display,
    fontSize: "32px",
    fontWeight: font.regular,
    lineHeight: 1.05,
    letterSpacing: "-0.03em",
  },
  bookAuthor: {
    fontFamily: font.mono,
    fontSize: "7px",
    letterSpacing: "0.13em",
  },
  bookmark: {
    position: "absolute",
    width: "15px",
    height: "32px",
    backgroundColor: color.accent,
    right: "19px",
    bottom: "-30px",
    clipPath: "polygon(0 0,100% 0,100% 100%,50% 75%,0 100%)",
  },
  letter: {
    position: "relative",
    width: { default: "clamp(220px, 18vw, 260px)", [media.compact]: "260px" },
    paddingBottom: "4px",
    transform: {
      default: "rotate(-8deg)",
      ":hover": "rotate(-3deg)",
      ":focus-visible": "rotate(-3deg)",
      [media.reduce]: "rotate(-8deg)",
    },
    transitionProperty: "transform",
    transitionDuration: { default: motionToken.slow, [media.reduce]: "0s" },
    transitionTimingFunction: motionToken.ease,
  },
  letterUnder: {
    position: "absolute",
    top: "9px",
    left: "5px",
    width: "100%",
    height: "230px",
    backgroundColor: material.paperEdge,
    transform: {
      default: "rotate(7deg)",
      [stylex.when.ancestor(":hover", objectMarker)]:
        "translate(4px, 2px) rotate(10deg)",
      [stylex.when.ancestor(":focus-visible", objectMarker)]:
        "translate(4px, 2px) rotate(10deg)",
      [media.reduce]: "rotate(7deg)",
    },
    transitionProperty: "transform",
    transitionDuration: { default: motionToken.slow, [media.reduce]: "0s" },
    transitionTimingFunction: motionToken.ease,
    boxShadow: shadow.contact,
  },
  letterSheet: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "240px",
    padding: "26px",
    backgroundColor: color.surface,
    backgroundImage: material.ruledPaper,
    transform: "rotate(3deg)",
    boxShadow: shadow.lifted,
  },
  letterHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontFamily: font.mono,
    fontSize: "7px",
    color: color.muted,
    letterSpacing: "0.06em",
    marginBottom: "26px",
  },
  letterCopy: {
    fontFamily: font.handwritten,
    fontSize: { default: "clamp(22px, 1.9vw, 27px)", [media.compact]: "27px" },
    lineHeight: 1.3,
    color: color.text,
  },
  signature: {
    marginTop: "18px",
    fontFamily: font.mono,
    fontSize: "8px",
    color: color.muted,
  },
  clip: {
    position: "absolute",
    top: "-17px",
    right: "38px",
    width: "15px",
    height: "48px",
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: material.metal,
    borderRadius: "10px",
    boxShadow: shadow.detail,
    transform: "rotate(12deg)",
  },
  calendar: {
    borderRadius: shape.small,
    position: "relative",
    width: "125px",
    transform: {
      default: "rotate(-7deg)",
      ":hover": "rotate(-2deg)",
      ":focus-visible": "rotate(-2deg)",
      [media.reduce]: "rotate(-7deg)",
    },
    transitionProperty: "transform",
    transitionDuration: { default: motionToken.slow, [media.reduce]: "0s" },
    transitionTimingFunction: motionToken.ease,
  },
  calendarPaper: {
    transformOrigin: "50% 0%",
    transform: {
      default: "perspective(500px) rotateX(0deg)",
      [stylex.when.ancestor(":hover", objectMarker)]:
        "perspective(500px) rotateX(-9deg)",
      [stylex.when.ancestor(":focus-visible", objectMarker)]:
        "perspective(500px) rotateX(-9deg)",
      [media.reduce]: "perspective(500px) rotateX(0deg)",
    },
    transitionProperty: "transform",
    transitionDuration: { default: motionToken.slow, [media.reduce]: "0s" },
    transitionTimingFunction: motionToken.ease,
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    backgroundColor: color.surface,
    borderRadius: shape.small,
    boxShadow: shadow.lifted,
    borderBottomWidth: "5px",
    borderBottomStyle: "double",
    borderBottomColor: `${material.paperEdge}`,
    overflow: "hidden",
  },
  calendarTop: {
    backgroundColor: material.bookBack,
    color: color.inverse,
    paddingTop: "14px",
    paddingRight: "8px",
    paddingBottom: "8px",
    paddingLeft: "8px",
    fontFamily: font.mono,
    fontSize: "8px",
    letterSpacing: "0.17em",
  },
  calendarMonth: {
    paddingTop: "14px",
    fontFamily: font.mono,
    fontSize: "8px",
    letterSpacing: "0.12em",
    color: color.muted,
  },
  calendarDate: {
    fontFamily: font.display,
    fontSize: "56px",
    lineHeight: 1.25,
    position: "relative",
  },
  calendarBottom: {
    fontFamily: font.display,
    fontStyle: "italic",
    fontSize: "11px",
    color: color.muted,
    paddingBottom: "17px",
  },
  rings: {
    position: "absolute",
    top: "-5px",
    left: "26px",
    right: "26px",
    display: "flex",
    justifyContent: "space-between",
    zIndex: 1,
  },
  ring: {
    display: "block",
    width: "5px",
    height: "17px",
    borderRadius: "4px",
    backgroundColor: material.binding,
    boxShadow: shadow.metal,
  },
  coffee: {
    position: "relative",
    width: "145px",
    height: "130px",
    transform: "rotate(13deg)",
  },
  saucer: {
    position: "absolute",
    width: "130px",
    height: "130px",
    borderRadius: shape.round,
    backgroundImage: material.saucer,
    boxShadow: shadow.lifted,
  },
  handle: {
    position: "absolute",
    right: "4px",
    top: "48px",
    width: "32px",
    height: "25px",
    borderWidth: "8px",
    borderStyle: "solid",
    borderColor: material.handle,
    borderTopLeftRadius: "5px",
    borderTopRightRadius: "11px",
    borderBottomRightRadius: "11px",
    borderBottomLeftRadius: "5px",
    boxShadow: shadow.detail,
  },
  cup: {
    position: "absolute",
    width: "91px",
    height: "91px",
    left: "19px",
    top: "18px",
    borderRadius: shape.round,
    borderWidth: "7px",
    borderStyle: "solid",
    borderColor: material.cup,
    backgroundImage: material.coffee,
    boxShadow: shadow.cup,
  },
  coffeeShine: {
    position: "absolute",
    left: "14px",
    top: "12px",
    width: "48px",
    height: "30px",
    borderTopWidth: "2px",
    borderTopStyle: "solid",
    borderTopColor: material.coffeeShine,
    borderRadius: shape.round,
    transform: "rotate(-25deg)",
  },
});
export function BookStack() {
  return (
    <DeskLink
      href="/posts"
      {...stylex.props(styles.books, objectMarker, foundation.objectLink)}
      aria-label="Browse posts"
    >
      <span {...stylex.props(styles.bookBack)} />
      <span {...stylex.props(styles.book)}>
        <span {...stylex.props(styles.bookIssue)}>NOTES & OBSERVATIONS</span>
        <span {...stylex.props(styles.bookTitle)}>
          Between
          <br />
          the lines.
        </span>
        <span {...stylex.props(styles.bookAuthor)}>WORDS BY ECH0XFF</span>
        <span {...stylex.props(styles.bookmark)} />
      </span>
      <span
        {...stylex.props(feedback.frame, styles.bookFrame)}
        aria-hidden="true"
      >
        <span {...stylex.props(feedback.label)}>Posts</span>
      </span>
    </DeskLink>
  );
}
export function Letter() {
  return (
    <DeskLink
      href="/thoughts"
      {...stylex.props(styles.letter, objectMarker, foundation.objectLink)}
      aria-label="Read thoughts"
    >
      <span {...stylex.props(styles.letterUnder)} />
      <span {...stylex.props(styles.letterSheet)}>
        <span {...stylex.props(styles.letterHeader)}>A NOTE TO SELF</span>
        <span {...stylex.props(styles.letterCopy)}>
          Pay attention.
          <br />
          The little things
          <br />
          are the big things.
        </span>
        <span {...stylex.props(styles.signature)}>— a passing thought</span>
      </span>
      <span
        {...stylex.props(feedback.frame, styles.letterFrame)}
        aria-hidden="true"
      >
        <span {...stylex.props(feedback.label)}>Thoughts</span>
      </span>
      <span {...stylex.props(styles.clip)} aria-hidden="true" />
    </DeskLink>
  );
}
export function Calendar() {
  return (
    <DeskLink
      href="/events"
      {...stylex.props(styles.calendar, objectMarker, foundation.objectLink)}
      aria-label="Explore events"
    >
      <span {...stylex.props(styles.rings)} aria-hidden="true">
        <i {...stylex.props(styles.ring)} />
        <i {...stylex.props(styles.ring)} />
      </span>
      <span {...stylex.props(styles.calendarPaper)}>
        <span {...stylex.props(styles.calendarTop)}>LIFE LATELY</span>
        <span {...stylex.props(styles.calendarMonth)}>SEPTEMBER</span>
        <span {...stylex.props(styles.calendarDate)}>12</span>
        <span {...stylex.props(styles.calendarBottom)}>one day at a time.</span>
      </span>
      <span {...stylex.props(feedback.frame)} aria-hidden="true">
        <span {...stylex.props(feedback.label)}>Events</span>
      </span>
    </DeskLink>
  );
}
export function Coffee() {
  return (
    <div {...stylex.props(styles.coffee)} aria-hidden="true">
      <span {...stylex.props(styles.saucer)} />
      <span {...stylex.props(styles.handle)} />
      <span {...stylex.props(styles.cup)}>
        <i {...stylex.props(styles.coffeeShine)} />
      </span>
    </div>
  );
}
