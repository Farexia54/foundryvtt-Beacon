// Import TypeScript modules
import { Beacon } from "../config";
import type {
  BeaconStatMacroData,
  BeaconTalentMacroData,
  BeaconTextMacroData,
  BeaconReactionMacroData,
} from "../interfaces";
import { EntryType, NpcFeatureType } from "machine-mind";
import { applyCollapseListeners } from "../helpers/collapse";
import { getMacroSpeaker, ownedItemFromString } from "./_util";
import { prepareAttackMacro } from "./attack";
import { rollReactionMacro } from "./reaction";
import { rollSystemMacro } from "./system";
import { rollTalentMacro } from "./talent";
import { prepareTechMacro } from "./tech";
import { rollTextMacro } from "./text";
import { rollTriggerMacro } from "./trigger";

const lp = Beacon.log_prefix;

/**
 * Generic macro preparer for any item.
 * Given an actor and item, will prepare data for the macro then roll it.
 * @param a The actor id to speak as
 * @param i The item id that is being rolled
 * @param options Ability to pass through various options to the item.
 *      Talents can use rank: value.
 *      Weapons can use accBonus or damBonus
 */
export async function prepareItemMacro(a: string, i: string, options?: any) {
  // Determine which Actor to speak as
  let actor = getMacroSpeaker(a);
  if (!actor) return;

  const item = ownedItemFromString(i, actor);
  if (!item) return;

  // Make a macro depending on the type
  switch (item.type) {
    // Skills
    case EntryType.SKILL:
      let skillData: BeaconStatMacroData = {
        title: item.name!,
        // @ts-expect-error Should be fixed with v10 types
        bonus: item.system.rank * 2,
      };
      await rollTriggerMacro(actor, skillData);
      break;
    // Pilot OR Mech weapon
    case EntryType.PILOT_WEAPON:
    case EntryType.MECH_WEAPON:
      await prepareAttackMacro({ actor, item, options });
      break;
    // Systems
    case EntryType.MECH_SYSTEM:
      // @ts-expect-error Should be fixed with v10 types
      await rollSystemMacro(actor, item.system.derived.mm!);
      break;
    // Talents
    case EntryType.TALENT:
      // If we aren't passed a rank, default to current rank
      // @ts-expect-error Should be fixed with v10 types
      let rank = options.rank ? options.rank : item.system.curr_rank;

      let talData: BeaconTalentMacroData = {
        // @ts-expect-error Should be fixed with v10 types
        talent: item.system,
        rank: rank,
      };

      await rollTalentMacro(actor, talData);
      break;
    // Gear
    case EntryType.PILOT_GEAR:
      let gearData: BeaconTextMacroData = {
        title: item.name!,
        // @ts-expect-error Should be fixed with v10 types
        description: item.system.description,
        // @ts-expect-error Should be fixed with v10 types
        tags: item.system.tags,
      };

      await rollTextMacro(actor, gearData);
      break;
    // Core bonuses can just be text, right?
    /*
    case EntryType.CORE_BONUS:
      let CBdata: BeaconTextMacroData = {
        title: item.name,
        description: item.system.effect,
      };

      await rollTextMacro(actor, CBdata);
      break;
      */
    case EntryType.NPC_FEATURE:
      // @ts-expect-error Should be fixed with v10 types
      switch (item.system.type) {
        case NpcFeatureType.Weapon:
          await prepareAttackMacro({ actor, item, options });
          break;
        case NpcFeatureType.Tech:
          await prepareTechMacro(a, i);
          break;
        case NpcFeatureType.System:
        case NpcFeatureType.Trait:
          let sysData: BeaconTextMacroData = {
            title: item.name!,
            // @ts-expect-error Should be fixed with v10 types
            description: item.system.effect,
            // @ts-expect-error Should be fixed with v10 types
            tags: item.system.tags,
          };

          await rollTextMacro(actor, sysData);
          break;
        case NpcFeatureType.Reaction:
          let reactData: BeaconReactionMacroData = {
            title: item.name!,
            // @ts-expect-error Should be fixed with v10 types
            trigger: item.system.trigger,
            // @ts-expect-error Should be fixed with v10 types
            effect: item.system.effect,
            // @ts-expect-error Should be fixed with v10 types
            tags: item.system.tags,
          };

          await rollReactionMacro(actor, reactData);
          break;
      }
      break;
    default:
      console.log("No macro exists for that item type");
      return ui.notifications!.error(`Error - No macro exists for that item type`);
  }

  applyCollapseListeners();
}
