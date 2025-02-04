import { BeaconItemType } from "./item/Beacon-item";
import { EffectData } from "./helpers/npc";
import { Damage, License, LiveEntryTypes, TagInstance } from "machine-mind";
import { BeaconActorType } from "./actor/Beacon-actor";

// ------------------------------------------------------
// |       SHEET DATA TYPES                             |
// ------------------------------------------------------

// These single generic type should cover all basic sheet use cases
export interface BeaconItemSheetData<T extends BeaconItemType> extends ItemSheet.Data<ItemSheet.Options> {
  // reg ctx
  mm: LiveEntryTypes<T>;

  // The license, if it could be recovered
  license: License | null;
}

export type CachedCloudPilot = {
  id: string;
  name: string;
  cloudID: string;
  cloudOwnerID: string;
};

export interface BeaconActorSheetData<T extends BeaconActorType> extends ActorSheet.Data<ActorSheet.Options> {
  // Item
  mm: LiveEntryTypes<T>;

  // Store active mech at the root level
  active_mech: Mech | null;
  // Store cloud pilot cache and potential cloud ids at the root level
  pilotCache: CachedCloudPilot[];
  cleanedOwnerID: string;
  vaultID: string;
  rawID: string;
}

// -------- Macro data -------------------------------------
declare interface BeaconStatMacroData {
  title: string;
  bonus: string | number;
  effect?: EffectData | string;
}

declare interface BeaconAttackMacroData {
  self_heat?: boolean;
  title: string;
  grit: number;
  acc: number;
  damage: Damage[];
  overkill?: boolean;
  effect?: EffectData | string;
  on_attack?: string;
  on_hit?: string; // For NPC weapons - to be removed once they use EffectData
  on_crit?: string;
  tags: TagInstance[];
  loaded?: boolean;
  destroyed?: boolean;
}

declare interface BeaconTechMacroData {
  title: string;
  t_atk: number;
  action: string;
  acc: number;
  effect: string;
  tags: TagDataShort[];
}

declare interface BeaconActionMacroData {
  title: string;
  t_atk: number;
  acc: number;
  actionName: string;
  detail: string;
  tags: TagDataShort[];
}

declare interface BeaconTalentMacroData {
  talent: BeaconTalentData;
  rank: number;
}

declare interface BeaconGenericMacroData {
  title: string;
  effect: EffectData | string;
}

declare interface BeaconReactionMacroData {
  title: string;
  trigger: string;
  effect: string;
  tags?: TagDataShort[];
}

declare interface BeaconTextMacroData {
  title: string;
  description: string;
  item_id?: string;
  tags?: TagDataShort[];
}

declare interface BeaconOverchargeMacroData {
  level: number;
  roll: Roll;
}

declare interface BeaconMacroData {
  fn: string;
  args: any[];
  iconPath?: string;
  title: string;
}

export interface GenControlContext<T> {
  // T is whatever is yielded by get_data/handled by commit_func
  // Raw information
  elt: HTMLElement;
  path: string;
  action: "delete" | "null" | "splice" | "set" | "append" | "insert";
  raw_val?: string;
  item_override_path?: string; // For writeback overriding

  // Deduced information
  data: T; // Typically the sheet data
  path_target: null | any; // What path resolved to on data, if anything
  item_override: AnyMMActor | AnyMMItem | null;
  parsed_val?: any; // Parsed version of raw_val

  // For hooks to use
  commit_func: (data: T) => void | Promise<void>;
}

// Context menu interface compatible with core foundry and our custom tippy menus
export interface ContextMenuItem {
  name: string;
  icon?: string; // class used to generate icon, if it should exist at all. e.x. "fa fa-fw fa-times"
  callback: (target: JQuery) => void | Promise<void>; // argument is the element to which the context menu attaches
}
