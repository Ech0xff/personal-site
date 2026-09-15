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
        display: placement(24, 45),
        record: placement(1040, 30),
        books: placement(70, 580),
        letter: placement(1100, 620),
        calendar: placement(425, 680),
        coffee: placement(870, 700),
        pencil: placement(370, 50),
      },
    },
    tablet: {
      width: 820,
      height: 1450,
      placements: {
        display: placement(20, 500),
        record: placement(450, 570),
        books: placement(35, 975),
        letter: placement(510, 1020),
        calendar: placement(285, 990),
        coffee: placement(340, 1270),
        pencil: placement(620, 1350),
      },
    },
    phone: {
      width: 390,
      height: 2250,
      placements: {
        display: placement(20, 490),
        record: placement(25, 960),
        books: placement(20, 1340),
        calendar: placement(140, 1650),
        coffee: placement(20, 1900),
        letter: placement(110, 2060),
        pencil: placement(180, 1950),
      },
    },
  },
});
