import { Beacon } from "../config";
import type { BeaconMacroData, BeaconTalentMacroData } from "../interfaces";
import { is_item_type, BeaconItem } from "../item/Beacon-item";
import { is_actor_type, BeaconActor } from "../actor/Beacon-actor";

const lp = Beacon.log_prefix;

const encodedMacroWhitelist = [
  "prepareActivationMacro",
  "prepareEncodedAttackMacro",
  "prepareTechMacro",
  "prepareStatMacro",
  "prepareItemMacro",
  "prepareTalentMacro",
  "prepareCoreActiveMacro",
  "prepareFrameTraitMacro",
  "prepareOverchargeMacro",
  "prepareStructureSecondaryRollMacro",
  "prepareOverheatMacro",
  "prepareStructureMacro",
  "stabilizeMacro",
  "structureMacro",
  "overheatMacro",
  "fullRepairMacro",
];

/**
 * Verifies the given data, will print specific errors/warnings on validation.
 * @param data The data to verify.
 */
export function isValidEncodedMacro(data: BeaconMacroData): boolean {
  if (encodedMacroWhitelist.indexOf(data.fn) < 0) {
    console.error(`Macro '${data.fn}' is not a whitelisted encoded macros.`);
    return false;
  }

  return true;
}

export function encodeMacroData(data: BeaconMacroData): string {
  return window.btoa(encodeURI(JSON.stringify(data)));
}

export async function runEncodedMacro(el: HTMLElement | BeaconMacroData) {
  console.log(el);
  let data: BeaconMacroData | null = null;

  if (el instanceof HTMLElement) {
    let encoded = el.attributes.getNamedItem("data-macro")?.nodeValue;
    if (!encoded) {
      console.warn("No macro data available");
      return;
    }

    data = JSON.parse(decodeURI(window.atob(encoded))) as BeaconMacroData;
  } else {
    data = el as BeaconMacroData;
  }

  if (!isValidEncodedMacro(data)) {
    console.error("Attempting to call invalid encoded macro");
    return;
  }

  let fn = game.Beacon[data.fn];
  return (fn as Function).apply(null, data.args);
}
