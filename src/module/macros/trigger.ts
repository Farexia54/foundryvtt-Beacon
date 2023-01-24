// Import TypeScript modules
import { Beacon } from "../config";
import type { BeaconActor } from "../actor/Beacon-actor";
import type { BeaconStatMacroData } from "../interfaces";
import { rollStatMacro } from "./stat";

const lp = Beacon.log_prefix;

export async function rollTriggerMacro(actor: BeaconActor, data: BeaconStatMacroData) {
  return await rollStatMacro(actor, data);
}
