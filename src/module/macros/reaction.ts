// Import TypeScript modules
import { Beacon } from "../config";
import type { BeaconActor } from "../actor/Beacon-actor";
import { BeaconReactionMacroData } from "../interfaces";
import { renderMacroTemplate } from "./_render";

const lp = Beacon.log_prefix;

/**
 * Rolls an NPC reaction macro when given the proper data
 * @param actor {Actor} Actor to roll as. Assumes properly prepared item.
 * @param data {BeaconReactionMacroData} Reaction macro data to render.
 */
export function rollReactionMacro(actor: BeaconActor, data: BeaconReactionMacroData) {
  if (!actor) return Promise.resolve();

  const template = `systems/${game.system.id}/templates/chat/reaction-card.hbs`;
  return renderMacroTemplate(actor, template, data);
}
