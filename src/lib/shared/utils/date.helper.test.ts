import { expect, test } from "bun:test";

import { resolveAppTimeZone } from "./date.helper";

test("invalid display timezones use the explicit application fallback", () => {
  for (const value of [undefined, "", "  ", "Invalid/Timezone"])
    expect(resolveAppTimeZone(value)).toBe("America/New_York");
  expect(resolveAppTimeZone("Asia/Shanghai")).toBe("Asia/Shanghai");
});
