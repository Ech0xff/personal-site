import assert from "node:assert/strict";
import test from "node:test";

import { createT } from "./create-t";

const messages = {
  navigation: {
    posts: "Posts",
  },
};

test("createT translates values from a selected scope", () => {
  const tNavigation = createT(messages).scope((message) => message.navigation);

  assert.equal(
    tNavigation((message) => message.posts),
    "Posts",
  );
});

test("scopes can be nested", () => {
  const t = createT({ page: messages });
  const tNavigation = t
    .scope((message) => message.page)
    .scope((message) => message.navigation);

  assert.equal(
    tNavigation((message) => message.posts),
    "Posts",
  );
});
