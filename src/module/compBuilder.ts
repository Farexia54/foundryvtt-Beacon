import { Beacon } from "./config";
const lp = Beacon.log_prefix;
import { EntryType, funcs, IContentPack, RegEnv, StaticReg } from "machine-mind";
import { FoundryReg } from "./mm-util/foundry-reg";
import { LCPIndex } from "./apps/lcpManager";
import { get_pack } from "./mm-util/helpers";
import type { BeaconActor } from "./actor/Beacon-actor";
import type { BeaconItem } from "./item/Beacon-item";

export const PACK_SCOPE = "world";

// Clear all packs
export async function clear_all(): Promise<void> {
  await set_all_lock(false);
  for (let p of Object.values(EntryType)) {
    let pack = game.packs.get(`${PACK_SCOPE}.${p}`);
    if (!pack) continue;

    let docs = await pack.getDocuments();
    let keys = docs.map(d => d.id!);
    await pack.documentClass.deleteDocuments(keys, { pack: pack.collection });
  }
  await set_all_lock(true);
}

export async function import_cp(
  cp: IContentPack,
  progress_callback?: (done: number, out_of: number) => void
): Promise<void> {
  await set_all_lock(false);

  try {
    // Stub in a progress callback so we don't have to null check it all the time
    if (!progress_callback) {
      progress_callback = (_a, _b) => {};
    }

    // Make a static reg, and load in the reg for pre-processing
    let env = new RegEnv();
    let tmp_lcp_reg = new StaticReg(env);
    await funcs.intake_pack(cp, tmp_lcp_reg);

    // Count the total items in the reg. We only do this for counting
    let total_items = 0;
    for (let type of Object.values(EntryType)) {
      let cat = tmp_lcp_reg.get_cat(type);
      total_items += (await cat.raw_map()).size;
    }

    // Iterate over everything in core, collecting all lids
    let existing_lids: string[] = [];
    for (let et of Object.values(EntryType)) {
      let pack = await get_pack(et);
      // Get them all
      let docs = await pack.getDocuments();
      // Get their ids
      // @ts-expect-error Should be fixed with v10 types
      let doc_lids = docs.map(d => (d as BeaconActor | BeaconItem).system.lid);
      existing_lids.push(...doc_lids);
    }

    // Import data to the actual foundry reg
    let comp_reg = new FoundryReg("comp_core");

    let transmit_count = 0;
    let progress_hook = (doc: any) => {
      if (doc.pack && !doc.parent) {
        // Presumably part of this import
        transmit_count++;
        progress_callback!(transmit_count, total_items);
      }
    };
    Hooks.on("createActor", progress_hook);
    Hooks.on("createItem", progress_hook);
    await funcs.intake_pack(cp, comp_reg, (_type, reg_val) => {
      return !existing_lids.includes(reg_val.lid);
    });
    Hooks.off("createActor", progress_hook);
    Hooks.off("createItem", progress_hook);

    // Finish by forcing all packs to re-prepare
    for (let p of Object.values(EntryType)) {
      (await get_pack(p)).clear();
    }
    progress_callback(transmit_count, total_items);
  } catch (err) {
    console.error(err);
  }
  await set_all_lock(true);
}

// Lock/Unlock all packs
export let IS_IMPORTING = false;
export async function set_all_lock(lock = false) {
  IS_IMPORTING = !lock;
  for (let p of Object.values(EntryType)) {
    const key = `${PACK_SCOPE}.${p}`;
    let pack = game.packs.get(key);
    await pack?.configure({ private: false, locked: lock });
  }
}

export async function clearCompendiumData() {
  ui.notifications!.info(`Clearing all Beacon Compendium data. Please wait.`);
  console.log(`${lp} Clearing all Beacon Compendium data.`);
  await game.settings.set(game.system.id, Beacon.setting_core_data, "0.0.0");
  await game.settings.set(game.system.id, Beacon.setting_lcps, new LCPIndex(null));
  await clear_all();
  ui.notifications!.info(`Beacon Compendiums cleared.`);
}
