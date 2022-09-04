import { LancerActorSheet } from "./lancer-actor-sheet";
import { EntryType } from "machine-mind";
import { LancerActor } from "./lancer-actor";
import { LancerItem } from "../item/lancer-item";
import { ResolvedDropData } from "../helpers/dragdrop";

/**
 * Extend the basic ActorSheet
 */
export class LancerDeployableSheet extends LancerActorSheet {
  /**
   * Extend and override the default options used by the NPC Sheet
   */
  static get defaultOptions(): ActorSheet.Options {
    return mergeObject(super.defaultOptions, {
      classes: ["lancer", "sheet", "actor", "npc"],
      template: `systems/${game.system.id}/templates/actor/deployable.hbs`,
      width: 800,
      height: 800,
      tabs: [
        {
          navSelector: ".lancer-tabs",
          contentSelector: ".sheet-body",
          initial: "status",
        },
      ],
    });
  }

  // Need to allow this stuff for setting deployable
  can_root_drop_entry(item: ResolvedDropData): boolean {
    // Accept actors
    return item.type == "Actor" && [EntryType.PILOT, EntryType.MECH, EntryType.NPC].includes(item.document.type);
  }

  /* -------------------------------------------- */

  /**
   * @override
   * Activate event listeners using the prepared sheet HTML
   * @param html {HTMLElement}   The prepared HTML object ready to be rendered into the DOM
   */
  activateListeners(html: any) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Add or Remove options
    // Yes, theoretically this could be abstracted out to one function. You do it then.
  }
}
