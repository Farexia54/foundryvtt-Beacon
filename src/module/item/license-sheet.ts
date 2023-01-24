import type { EntryType, LicensedItem } from "machine-mind";
import { FoundryReg } from "../mm-util/foundry-reg";
import { BeaconItemSheet } from "./item-sheet";
import { HANDLER_activate_item_context_menus } from "../helpers/item";
import { BeaconItemSheetData } from "../interfaces";

/**
 * Extend the generic Beacon item sheet
 * @extends {BeaconItemSheet}
 */
export class BeaconLicenseSheet extends BeaconItemSheet<EntryType.LICENSE> {
  /**
   * @override
   * Extend and override the default options used by the generic Beacon item sheet
   */
  static get defaultOptions(): ItemSheet.Options {
    return mergeObject(super.defaultOptions, {
      width: 700,
      height: 750,
    });
  }

  async getData() {
    let sup = await super.getData();

    // Perform a scan of the compendium
    let comp_reg = new FoundryReg("comp_core");
    console.warn("Todo: also allow scan to hit any other compendiums"); // They just gotta be provided in the scan array argument
    let scan = await sup.mm.scan([comp_reg], sup.mm.OpCtx);

    // Build an unlocks array
    let ranks = Array.from(scan.ByLevel.keys()).sort();
    let unlocks: LicensedItem[][] = [];
    if (ranks.length) {
      for (let i = 0; i <= ranks[ranks.length - 1]; i++) {
        unlocks.push(scan.ByLevel.get(i) ?? []);
      }
    }

    // Put the unlocks array in. Don't bother meddling the type
    (sup as any)["unlocks"] = unlocks;

    // Pass it along
    return sup;
  }

  /**
   * @override
   */
  _activate_context_listeners(
    html: JQuery,
    // Retrieves the data that we will operate on
    data_getter: () => Promise<BeaconItemSheetData<EntryType.LICENSE>> | BeaconItemSheetData<EntryType.LICENSE>,
    commit_func: (data: BeaconItemSheetData<EntryType.LICENSE>) => void | Promise<void>
  ) {
    // Enable custom context menu triggers with only the "view" option.
    HANDLER_activate_item_context_menus(html, data_getter, commit_func, true);
  }

  /**
   * @override
   * Activate event listeners using the prepared sheet HTML
   * @param html {JQuery}   The prepared HTML object ready to be rendered into the DOM
   */
  activateListeners(html: JQuery) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // TODO: Add refresh button
  }
}
