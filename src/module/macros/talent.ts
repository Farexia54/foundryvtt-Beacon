// Import TypeScript modules
import { Beacon } from "../config";
import type { BeaconActor } from "../actor/Beacon-actor";
import type { BeaconTalentMacroData } from "../interfaces";
import { renderMacroTemplate } from "./_render";
import { getMacroSpeaker, ownedItemFromString } from "./_util";

const lp = Beacon.log_prefix;

/**
 * Generic macro preparer for a talent
 * Given an actor and item, will prepare data for the macro then roll it.
 * @param a The actor id to speak as
 * @param i The item id that is being rolled
 * @param rank The rank of the talent to roll
 */
export async function prepareTalentMacro(a: string, i: string, rank: number) {
  // Determine which Actor to speak as
  let actor = getMacroSpeaker(a);
  if (!actor) return;

  const item = ownedItemFromString(i, actor);
  if (!item || !item.is_talent()) return;

  let talData: BeaconTalentMacroData = {
    // @ts-expect-error Should be fixed with v10 types
    talent: item.system,
    rank: rank,
  };

  await rollTalentMacro(actor, talData);
}

export async function rollTalentMacro(actor: BeaconActor, data: BeaconTalentMacroData) {
  if (!actor) return Promise.resolve();

  // Construct the template
  const templateData = {
    title: data.talent.name,
    rank: data.talent.ranks[data.rank],
    lvl: data.rank,
  };
  const template = `systems/${game.system.id}/templates/chat/talent-card.hbs`;
  return renderMacroTemplate(actor, template, templateData);
}
