// Import TypeScript modules
import { Beacon } from "../config";
import type { BeaconActor } from "../actor/Beacon-actor";
import type { BeaconTextMacroData } from "../interfaces";
import { TagInstance } from "machine-mind";
import { getMacroSpeaker } from "./_util";
import { renderMacroTemplate } from "./_render";

const lp = Beacon.log_prefix;

/**
 * Given basic information, prepares a generic text-only macro to display descriptions etc
 * @param a     String of the actor ID to roll the macro as
 * @param title Data path to title of the macro
 * @param text  Data path to text to be displayed by the macro
 * @param tags  Can optionally pass through an array of tags to be rendered
 */
export function prepareTextMacro(a: string, title: string, text: string, tags?: TagInstance[]) {
  // Determine which Actor to speak as
  let actor = getMacroSpeaker(a);
  if (!actor) return;

  // Note to self--use this in the future if I need string -> var lookup: var.split('.').reduce((o,i)=>o[i], game.data)
  let mData: BeaconTextMacroData = {
    title: title,
    description: text,
    tags: tags,
  };

  rollTextMacro(actor, mData).then();
}

/**
 * Given prepared data, handles rolling of a generic text-only macro to display descriptions etc.
 * @param actor {Actor} Actor rolling the macro.
 * @param data {BeaconTextMacroData} Prepared macro data.
 */
export async function rollTextMacro(actor: BeaconActor, data: BeaconTextMacroData) {
  if (!actor) return Promise.resolve();

  const template = `systems/${game.system.id}/templates/chat/generic-card.hbs`;
  return renderMacroTemplate(actor, template, data);
}
