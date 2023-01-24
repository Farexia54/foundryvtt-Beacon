// Import TypeScript modules
import { Beacon } from "../config";
import type { BeaconActor } from "../actor/Beacon-actor";
import { buildSystemHTML } from "../helpers/item";
import type { MechSystem } from "machine-mind";
import { renderMacroHTML } from "./_render";

const lp = Beacon.log_prefix;

export async function rollSystemMacro(actor: BeaconActor, data: MechSystem) {
  if (!actor) return Promise.resolve();

  // Construct the template
  const html = buildSystemHTML(data);
  return renderMacroHTML(actor, html);
}
