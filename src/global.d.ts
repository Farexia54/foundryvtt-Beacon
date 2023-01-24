import type { BeaconInitiativeConfig } from "Beacon-initiative";
import type { IContentPackManifest } from "machine-mind";
import type { AutomationOptions } from "./module/settings";
import type { BeaconActionManager } from "./module/action/actionManager";

declare global {
  // Since we never use these before `init` tell league types that they are
  // never undefined
  interface LenientGlobalVariableTypes {
    game: never;
    canvas: never;
  }

  namespace Game {
    interface SystemData<T> {
      id: "Beacon";
    }
  }
  interface Game {
    Beacon: {
      [x: string]: unknown;
    };
    action_manager?: BeaconActionManager;
  }

  interface CONFIG {
    BeaconInitiative: BeaconInitiativeConfig<Game["system"]["id"]>;
  }

  namespace ClientSettings {
    interface Values {
      "Beacon.systemMigrationVersion": string;
      "Beacon.coreDataVersion": string;
      "Beacon.installedLCPs": {
        index: IContentPackManifest[];
      };
      "Beacon.keepStockIcons": boolean;
      "Beacon.hideWelcome": boolean;
      "Beacon.automationOptions": Partial<AutomationOptions>;
      "Beacon.automationSwitch": boolean;
      "Beacon.attackSwitch": boolean;
      "Beacon.actionManager": boolean;
      "Beacon.actionManagerPlayersUse": boolean;
      "Beacon.autoOCHeat": boolean;
      "Beacon.autoOKillHeat": boolean;
      "Beacon.autoCalcStructure": boolean;
      "Beacon.squareGridDiagonals": "111" | "121" | "222" | "euc";
      // "Beacon.warningFor120": boolean; // Old setting, currently unused.
      // "Beacon.warningForBeta": boolean; // Old setting, currently unused.
      "Beacon.combatTrackerConfig": { sortTracker: boolean } | ClientSettings.Values["Beacon.combatTrackerConfig"];
      "Beacon.dsnSetup": boolean;
      "Beacon.combat-tracker-appearance": Partial<BeaconInitiativeConfig["def_appearance"]>;
    }
  }
}
