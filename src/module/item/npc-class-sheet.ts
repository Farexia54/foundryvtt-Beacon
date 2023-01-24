import type { EntryType } from "machine-mind";
import { Beacon } from "../config";
import { BeaconItemSheet } from "./item-sheet";
import type { BeaconItem } from "./Beacon-item";
const lp = Beacon.log_prefix;

/**
 * Extend the generic Beacon item sheet
 * @extends {BeaconItemSheet}
 */
export class BeaconNPCClassSheet extends BeaconItemSheet<EntryType.NPC_CLASS> {
  /**
   * @override
   * Extend and override the default options used by the generic Beacon item sheet
   */
  static get defaultOptions(): ItemSheet.Options {
    return mergeObject(super.defaultOptions, {
      width: 900,
      height: 750,
      dragDrop: [{ dragSelector: ".item" }],
    });
  }

  base_feature_items!: (BeaconItem["data"] & { type: EntryType.NPC_FEATURE })[];
  optional_feature_items!: (BeaconItem["data"] & { type: EntryType.NPC_FEATURE })[];

  /** @override */
  _updateObject(_event: any, formData: any) {
    formData["data.stats.hp"] = BeaconNPCClassSheet.arrayifyStats(formData["data.stats.hp"]);
    formData["data.stats.heatcap"] = BeaconNPCClassSheet.arrayifyStats(formData["data.stats.heatcap"]);
    formData["data.stats.structure"] = BeaconNPCClassSheet.arrayifyStats(formData["data.stats.structure"]);
    formData["data.stats.stress"] = BeaconNPCClassSheet.arrayifyStats(formData["data.stats.stress"]);
    formData["data.stats.armor"] = BeaconNPCClassSheet.arrayifyStats(formData["data.stats.armor"]);
    formData["data.stats.evasion"] = BeaconNPCClassSheet.arrayifyStats(formData["data.stats.evasion"]);
    formData["data.stats.edef"] = BeaconNPCClassSheet.arrayifyStats(formData["data.stats.edef"]);
    formData["data.stats.speed"] = BeaconNPCClassSheet.arrayifyStats(formData["data.stats.speed"]);
    formData["data.stats.sensor_range"] = BeaconNPCClassSheet.arrayifyStats(formData["data.stats.sensor_range"]);
    formData["data.stats.save"] = BeaconNPCClassSheet.arrayifyStats(formData["data.stats.save"]);
    formData["data.stats.activations"] = BeaconNPCClassSheet.arrayifyStats(formData["data.stats.activations"]);
    formData["data.stats.size"] = BeaconNPCClassSheet.arrayifyStats(formData["data.stats.size"]);
    formData["data.stats.hull"] = BeaconNPCClassSheet.arrayifyStats(formData["data.stats.hull"]);
    formData["data.stats.agility"] = BeaconNPCClassSheet.arrayifyStats(formData["data.stats.agility"]);
    formData["data.stats.systems"] = BeaconNPCClassSheet.arrayifyStats(formData["data.stats.systems"]);
    formData["data.stats.engineering"] = BeaconNPCClassSheet.arrayifyStats(formData["data.stats.engineering"]);

    formData["data.stats.size"] = (formData["data.stats.size"] as number[]).map(x => {
      if (x < 0.5) return 0.5;
      else if (x !== 0.5 && x % 1 < 1) return Math.floor(x);
      else return x;
    });

    console.log(`${lp} Item sheet form data: `, formData);

    // Propogate to owner
    // TODO: still needed with new MM?
    // if(this.item.isOwned) {
    //   (<BeaconActor>this.item.actor).swapNPCClassOrTier((<BeaconNPCClass>this.item).system.stats,false);
    // }

    // Update the Item
    return this.object.update(formData);
  }

  static arrayifyStats(data: string[]) {
    return data.map(x => parseFloat(x));
  }

  // TODO: npc_feature_preview expects a path to the feature, not a feature reference
  /*
  private _displayFeatures(features: BeaconNpcFeatureData[], elementToReplace: JQuery<Element>) {
    let featureItems = features
      .map(feature => {
        return npc_feature_preview(feature, 0, {});
      })
      .map(featureItem => {
        if (featureItem) {
          const element = jQuery(featureItem);
          element.each((i: number, item: any) => {
            item.setAttribute("draggable", "true");
            item.addEventListener("dragstart", (ev: DragEvent) => this._onDragStart(ev), false);
          });
          return element;
        }
        return jQuery("");
      })
      .map(element => element[0]);

    elementToReplace.replaceWith(featureItems);
  }
   */
}
