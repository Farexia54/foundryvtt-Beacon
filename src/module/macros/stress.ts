// Import TypeScript modules
import { Beacon } from "../config";
import type { BeaconActor } from "../actor/Beacon-actor";
import { getAutomationOptions } from "../settings";
import { getMacroSpeaker } from "./_util";

const lp = Beacon.log_prefix;

/**
 * Performs a roll on the overheat table for the given actor
 * @param a           - Actor or ID of actor to overheat
 * @param reroll_data - Data to use if rerolling. Setting this also supresses the dialog.
 */
export async function prepareOverheatMacro(a: string | BeaconActor, reroll_data?: { stress: number }): Promise<void> {
  // Determine which Actor to speak as
  let actor = getMacroSpeaker(a);
  if (!actor) return;

  if (!actor.is_mech() && !actor.is_npc()) {
    ui.notifications!.warn("Only Mechs and NPCs can overheat");
    return;
  }

  if (getAutomationOptions().structure && !reroll_data) {
    // @ts-expect-error Should be fixed with v10 types
    const mech = await actor.system.derived.mm_promise;
    if (mech.CurrentHeat <= mech.HeatCapacity) {
      ui.notifications!.info("Token heat is within heat cap.");
      return;
    }
    const { open } = await import("../helpers/slidinghud");
    try {
      await open("stress", { stat: "stress", title: "Overheating", BeaconActor: actor });
    } catch (_e) {
      return;
    }
  }

  // Hand it off to the actor to overheat
  await actor.overheat(reroll_data);
}
