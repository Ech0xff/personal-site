import assert from "node:assert/strict";
import test from "node:test";

import { introGreetings } from "./desk-content.const";
import { shouldPlayIntro, shuffleGreetings } from "./intro.helper";
await test("only fresh homepage loads and reloads play greetings", () => {
  assert.equal(shouldPlayIntro("/", "navigate", false), true);
  assert.equal(shouldPlayIntro("/", "reload", false), true);
  assert.equal(shouldPlayIntro("/", "back_forward", false), false);
  assert.equal(shouldPlayIntro("/posts", "reload", false), false);
  assert.equal(shouldPlayIntro("/", "navigate", true), false);
  assert.equal(shouldPlayIntro("/", undefined, false), true);
});

await test("greeting permutations preserve every word once without changing the source", () => {
  const original = [...introGreetings];
  const first = shuffleGreetings(
    introGreetings,
    introGreetings.map(() => 0),
  );
  const second = shuffleGreetings(
    introGreetings,
    introGreetings.map(() => 0.99),
  );
  assert.deepEqual([...first].sort(), [...original].sort());
  assert.equal(new Set(first).size, original.length);
  assert.equal(first.filter((word) => word === "Ciallo~").length, 1);
  assert.notDeepEqual(first, second);
  assert.deepEqual([...introGreetings], original);
});
