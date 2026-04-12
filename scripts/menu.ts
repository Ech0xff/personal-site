import { stdin as input, stdout as output } from "process";
import { createInterface } from "readline/promises";

import { loadEnvConfig } from "./common";
import { rebindWebhook } from "./rebind-webhook";
import { resetDb } from "./reset-db";
import { setAdmin } from "./set-admin";

interface MenuItem {
  label: string;
  callback?: (envPath: string) => Promise<void>;
}
const menus: MenuItem[] = [
  { label: "Reset database", callback: resetDb },
  { label: "Rebind webhooks", callback: rebindWebhook },
  { label: "Promote user to admin", callback: setAdmin },
];

const selectMenu = async () => {
  const rl = createInterface({ input, output });
  try {
    menus.forEach((item, index) => {
      console.log(`${index + 1}. ${item.label}`);
    });
    const answer = await rl.question("Enter the menu number: ");
    const selectedIndex = Number(answer.trim()) - 1;
    if (
      Number.isInteger(selectedIndex) &&
      selectedIndex >= 0 &&
      selectedIndex < menus.length
    )
      return menus[selectedIndex];
    console.log("Invalid input. Please enter a valid menu number.");
  } finally {
    rl.close();
  }
};

(async () => {
  try {
    const envPath = loadEnvConfig(process.argv[2]);
    console.log(`Select an action: (Current environment: ${envPath})`);
    const menu = await selectMenu();

    if (!menu) {
      process.exit(1);
    }

    if (!menu.callback) {
      console.log(`"${menu.label}" is not implemented yet.`);
      process.exit(0);
    }

    await menu.callback(envPath);
  } catch (error) {
    console.error(
      "❌ Failed to run selected action:",
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
})();
