import { deskItemDefinitions } from "./desk-item.schema";
import { deskConfigurationSchema } from "./desk-layout.schema";

const placement = (x: number, y: number, scale = 1) => ({ x, y, scale });
export const defaultDeskConfiguration = deskConfigurationSchema.parse({
  items: Object.entries(deskItemDefinitions).map(([type, definition]) => ({
    id: type,
    type,
    name: definition.name,
    config: definition.defaultConfig,
  })),
  layouts: {
    desktop: {
      width: 1440,
      height: 900,
      placements: {
        display: placement(4, 54, 0.85),
        record: placement(1059, 2),
        books: placement(76, 566),
        letter: placement(1070, 560),
        coffee: placement(800, 696),
        pencil: placement(370, 26),
      },
    },
    tablet: {
      width: 820,
      height: 1450,
      placements: {
        display: placement(20, 500, 0.85),
        record: placement(450, 570),
        books: placement(35, 975),
        letter: placement(510, 1020),
        coffee: placement(340, 1270),
        pencil: placement(620, 1350),
      },
    },
    phone: {
      width: 390,
      height: 2250,
      placements: {
        display: placement(20, 490, 0.85),
        record: placement(25, 960),
        books: placement(20, 1340),
        coffee: placement(20, 1900),
        letter: placement(110, 2060),
        pencil: placement(180, 1950),
      },
    },
  },
});
