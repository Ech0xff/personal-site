import * as stylex from "@stylexjs/stylex";
import Image from "next/image";
import { useState } from "react";

import { shape, material } from "#design/tokens.stylex";

import { getGuestbookAvatarUrl } from "./guestbook-avatar.helper";
import { GuestbookFieldIcon } from "./guestbook-field-icon.component";

function useGuestbookAvatar(githubUsername?: string) {
  const url = getGuestbookAvatarUrl(githubUsername);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  return {
    url: url === failedUrl ? null : url,
    failed: () => setFailedUrl(url),
  };
}

const styles = stylex.create({
  avatar: {
    width: "26px",
    height: "26px",
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: shape.round,
    color: material.phosphor,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});

export function GuestbookAvatar({
  githubUsername,
}: Readonly<{ githubUsername?: string }>) {
  const avatar = useGuestbookAvatar(githubUsername);
  return (
    <span aria-hidden="true" {...stylex.props(styles.avatar)}>
      {avatar.url ? (
        <Image
          src={avatar.url}
          alt=""
          width={26}
          height={26}
          unoptimized
          referrerPolicy="no-referrer"
          onError={avatar.failed}
          {...stylex.props(styles.image)}
        />
      ) : (
        <GuestbookFieldIcon field="name" />
      )}
    </span>
  );
}
