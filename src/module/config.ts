// Namespace configuration Values

import { EntryType, NpcFeatureType } from "machine-mind";
import type { BeaconActorType } from "./actor/Beacon-actor";
import type { BeaconItemType } from "./item/Beacon-item";

const ASCII = `
╭╮╱╱╭━━━┳━╮╱╭┳━━━┳━━━┳━━━╮ 
┃┃╱╱┃╭━╮┃┃╰╮┃┃╭━╮┃╭━━┫╭━╮┃ 
┃┃╱╱┃┃╱┃┃╭╮╰╯┃┃╱╰┫╰━━┫╰━╯┃ 
┃┃╱╭┫╰━╯┃┃╰╮┃┃┃╱╭┫╭━━┫╭╮╭╯ 
┃╰━╯┃╭━╮┃┃╱┃┃┃╰━╯┃╰━━┫┃┃╰╮ 
╰━━━┻╯╱╰┻╯╱╰━┻━━━┻━━━┻╯╰━╯`;

let ET = EntryType;
// These are general categories that items fall under, useful for the purpose of knowing when moving that item is allowed
const mech_items: BeaconItemType[] = [ET.WEAPON_MOD, ET.FRAME, ET.MECH_WEAPON, ET.MECH_SYSTEM];
const pilot_items: BeaconItemType[] = [
  ET.SKILL,
  ET.TALENT,
  ET.CORE_BONUS,
  ET.LICENSE,
  ET.PILOT_ARMOR,
  ET.PILOT_WEAPON,
  ET.PILOT_GEAR,
  ET.FACTION,
  ET.QUIRK,
  ET.RESERVE,
  ET.ORGANIZATION,
];
const npc_items: BeaconItemType[] = [ET.NPC_CLASS, ET.NPC_FEATURE, ET.NPC_TEMPLATE];
const weapon_items: BeaconItemType[] = [ET.MECH_WEAPON, ET.PILOT_WEAPON, ET.NPC_FEATURE];

export type BeaconDocumentType = BeaconItemType | BeaconActorType;

export const STATUSES = [
  {
    id: "immobilized",
    label: "Immobilized",
    icon: `systems/Beacon/assets/icons/white/condition_immobilized.svg`,
  },
  {
    id: "impaired",
    label: "Impaired",
    icon: `systems/Beacon/assets/icons/white/condition_impaired.svg`,
  },
  {
    id: "jammed",
    label: "Jammed",
    icon: `systems/Beacon/assets/icons/white/condition_jammed.svg`,
  },
  {
    id: "lockon",
    label: "Lock On",
    icon: `systems/Beacon/assets/icons/white/condition_lockon.svg`,
  },
  {
    id: "shredded",
    label: "Shredded",
    icon: `systems/Beacon/assets/icons/white/condition_shredded.svg`,
  },
  {
    id: "slowed",
    label: "Slowed",
    icon: `systems/Beacon/assets/icons/white/condition_slow.svg`,
  },
  {
    id: "stunned",
    label: "Stunned",
    icon: `systems/Beacon/assets/icons/white/condition_stunned.svg`,
  },
  {
    id: "dangerzone",
    label: "Danger Zone",
    icon: `systems/Beacon/assets/icons/white/status_dangerzone.svg`,
  },
  {
    id: "downandout",
    label: "Down and Out",
    icon: `systems/Beacon/assets/icons/white/status_downandout.svg`,
  },
  {
    id: "engaged",
    label: "Engaged",
    icon: `systems/Beacon/assets/icons/white/status_engaged.svg`,
  },
  {
    id: "exposed",
    label: "Exposed",
    icon: `systems/Beacon/assets/icons/white/status_exposed.svg`,
  },
  {
    id: "hidden",
    label: "Hidden",
    icon: `systems/Beacon/assets/icons/white/status_hidden.svg`,
  },
  {
    id: "invisible",
    label: "Invisible",
    icon: `systems/Beacon/assets/icons/white/status_invisible.svg`,
  },
  {
    id: "prone",
    label: "Prone",
    icon: `systems/Beacon/assets/icons/white/status_prone.svg`,
  },
  {
    id: "shutdown",
    label: "Shut Down",
    icon: `systems/Beacon/assets/icons/white/status_shutdown.svg`,
  },
  {
    id: "npc_tier_1",
    label: "Tier 1",
    icon: `systems/Beacon/assets/icons/white/npc_tier_1.svg`,
  },
  {
    id: "npc_tier_2",
    label: "Tier 2",
    icon: `systems/Beacon/assets/icons/white/npc_tier_2.svg`,
  },
  {
    id: "npc_tier_3",
    label: "Tier 3",
    icon: `systems/Beacon/assets/icons/white/npc_tier_3.svg`,
  },
];

export function WELCOME(changelog: string): string {
  return `<div style="margin: 10px 5px">
  <div style="text-align: center; margin-top: .5em" class="flex-center">
    <a href="https://massifpress.com/legal">
      <img style="max-width: 350px; border: none" src="https://massifpress.com/_next/image?url=%2Fimages%2Flegal%2Fpowered_by_Beacon-01.svg&w=640&q=75" alt="Powered by Beacon">
    </a>
  </div>
  <h2>Welcome to Beacon on Foundry!</h2>
  <p>If you haven't already, check out the project wiki for 
  <a href="https://github.com/Eranziel/foundryvtt-Beacon/wiki/FAQ">FAQ</a>
  and a list of <a href="https://github.com/Eranziel/foundryvtt-Beacon/wiki/Resources">recommended modules</a>, as well
  as other information about how to use the system.</p>
  
  <span>Special thanks to <a class="center" href="https://www.retrogrademinis.com/">Retrograde Minis</a> for our default token artwork.</span>

  <div style="text-align: center; margin-top: .5em" class="flex-center">
    <a href="https://www.retrogrademinis.com/">
      <img style="max-width: 350px; border: none" src="https://retrograde-minis.nyc3.digitaloceanspaces.com/text/retrograde-logo.png" alt="Retrograde Minis">
    </a>
  </div>

  <p>You can report issues on GitHub here: 
  <a href="https://github.com/Eranziel/foundryvtt-Beacon/issues">https://github.com/Eranziel/foundryvtt-Beacon/issues</a></p>
  <br/>
  <h2>Legal</h2>
  <p>"Beacon for FoundryVTT" is not an official <i>Beacon</i> product; it is a third party work, and is not affiliated with Massif Press. "Beacon for FoundryVTT" is published via the <i>Beacon</i> Third Party License.</p>
  <p><i>Beacon</i> is copyright Massif Press.</p>
  <br/>
  <p>
    <h1>Change Log:</h1>
    ${changelog}
  </p>
  
  <p><a href="https://github.com/Eranziel/foundryvtt-Beacon/blob/master/CHANGELOG.md">Click here for the full changelog.</a></p>
  </div>
  `;
}

// Modify these constants to set which Beacon version numbers need and permit migration.
export const NEEDS_MAJOR_MIGRATION_VERSION = "0.9.0";
export const NEEDS_MINOR_MIGRATION_VERSION = "0.9.99";
export const COMPATIBLE_MIGRATION_VERSION = "0.1.0";
export const NEEDS_AUTOMATION_MIGRATION_VERSION = "1.0.3";

export const Beacon = {
  ASCII,
  log_prefix: "Beacon |" as const,
  setting_migration: "systemMigrationVersion" as const,
  setting_core_data: "coreDataVersion" as const,
  setting_lcps: "installedLCPs" as const,
  setting_stock_icons: "keepStockIcons" as const,
  setting_welcome: "hideWelcome" as const,
  setting_compcon_login: "compconLogin" as const,
  setting_automation: "automationOptions" as const,
  setting_automation_switch: "automationSwitch" as const,
  setting_automation_attack: "attackSwitch" as const,
  setting_actionTracker: "actionTracker" as const,
  setting_pilot_oc_heat: "autoOCHeat" as const,
  setting_overkill_heat: "autoOKillHeat" as const,
  setting_auto_structure: "autoCalcStructure" as const,
  setting_dsn_setup: "dsnSetup" as const,
  setting_square_grid_diagonals: "squareGridDiagonals" as const,
  // setting_120: "warningFor120" as const, // Old setting, currently unused.
  // setting_beta_warning: "warningForBeta" as const, // Old setting, currently unused.
  mech_items,
  pilot_items,
  weapon_items,
  npc_items,
};

// Convenience for mapping item/actor types to full names
const FRIENDLY_DOCUMENT_NAMES_SINGULAR = {
  [EntryType.CORE_BONUS]: "Core Bonus",
  [EntryType.DEPLOYABLE]: "Deployable",
  [EntryType.ENVIRONMENT]: "Environment",
  [EntryType.FACTION]: "Faction",
  [EntryType.FRAME]: "Frame",
  [EntryType.LICENSE]: "License",
  [EntryType.MANUFACTURER]: "Manufacturer",
  [EntryType.MECH]: "Mech",
  [EntryType.MECH_SYSTEM]: "Mech System",
  [EntryType.MECH_WEAPON]: "Mech Weapon",
  [EntryType.NPC]: "Npc",
  [EntryType.NPC_CLASS]: "Npc Class",
  [EntryType.NPC_FEATURE]: "Npc Feature",
  [EntryType.NPC_TEMPLATE]: "Npc Template",
  [EntryType.ORGANIZATION]: "Organization",
  [EntryType.PILOT]: "Pilot Preset",
  [EntryType.PILOT_ARMOR]: "Pilot Armor",
  [EntryType.PILOT_GEAR]: "Pilot Gear",
  [EntryType.PILOT_WEAPON]: "Pilot Weapon",
  [EntryType.QUIRK]: "Quirk",
  [EntryType.RESERVE]: "Reserve",
  [EntryType.SITREP]: "Sitrep",
  [EntryType.SKILL]: "Skill",
  [EntryType.STATUS]: "Status/Condition",
  [EntryType.TAG]: "Tag",
  [EntryType.TALENT]: "Talent",
  [EntryType.WEAPON_MOD]: "Weapon Mod",
};
const FRIENDLY_DOCUMENT_NAMES_PLURAL = {
  [EntryType.CORE_BONUS]: "Core Bonuses",
  [EntryType.DEPLOYABLE]: "Deployables",
  [EntryType.ENVIRONMENT]: "Environments",
  [EntryType.FACTION]: "Factions",
  [EntryType.FRAME]: "Frames",
  [EntryType.LICENSE]: "Licenses",
  [EntryType.MANUFACTURER]: "Manufacturers",
  [EntryType.MECH]: "Mechs",
  [EntryType.MECH_SYSTEM]: "Mech Systems",
  [EntryType.MECH_WEAPON]: "Mech Weapons",
  [EntryType.NPC]: "Npcs",
  [EntryType.NPC_CLASS]: "Npc Classes",
  [EntryType.NPC_FEATURE]: "Npc Features",
  [EntryType.NPC_TEMPLATE]: "Npc Templates",
  [EntryType.ORGANIZATION]: "Organizations",
  [EntryType.PILOT]: "Pilot Presets",
  [EntryType.PILOT_ARMOR]: "Pilot Armor",
  [EntryType.PILOT_GEAR]: "Pilot Gear",
  [EntryType.PILOT_WEAPON]: "Pilot Weapons",
  [EntryType.QUIRK]: "Quirks",
  [EntryType.RESERVE]: "Reserves",
  [EntryType.SITREP]: "Sitreps",
  [EntryType.SKILL]: "Skills",
  [EntryType.STATUS]: "Statuses / Conditions",
  [EntryType.TAG]: "Tags",
  [EntryType.TALENT]: "Talents",
  [EntryType.WEAPON_MOD]: "Weapon Mods",
};

// Quick for single/plural
export function friendly_entrytype_name(type: BeaconItemType | BeaconActorType, count?: number): string {
  if ((count ?? 1) > 1) {
    return FRIENDLY_DOCUMENT_NAMES_PLURAL[type] ?? `Unknown <${type}>s`;
  } else {
    return FRIENDLY_DOCUMENT_NAMES_SINGULAR[type] ?? `Unknown <${type}>`;
  }
}

// Icons for each document
export const GENERIC_ITEM_ICON = "systems/Beacon/assets/icons/generic_item.svg";
const DOCUMENT_ICONS = {
  [EntryType.CORE_BONUS]: `systems/Beacon/assets/icons/core_bonus.svg`,
  [EntryType.DEPLOYABLE]: `systems/Beacon/assets/icons/deployable.svg`,
  [EntryType.ENVIRONMENT]: `systems/Beacon/assets/icons/orbit.svg`,
  [EntryType.FACTION]: `systems/Beacon/assets/icons/encounter.svg`,
  [EntryType.FRAME]: `systems/Beacon/assets/icons/mech.svg`,
  [EntryType.LICENSE]: `systems/Beacon/assets/icons/license.svg`,
  [EntryType.MANUFACTURER]: `systems/Beacon/assets/icons/manufacturer.svg`,
  [EntryType.MECH]: `systems/Beacon/assets/icons/mech.svg`,
  [EntryType.MECH_SYSTEM]: `systems/Beacon/assets/icons/mech_system.svg`,
  [EntryType.MECH_WEAPON]: `systems/Beacon/assets/icons/mech_weapon.svg`,
  [EntryType.NPC]: `systems/Beacon/assets/icons/npc_class.svg`,
  [EntryType.NPC_CLASS]: `systems/Beacon/assets/icons/npc_class.svg`,
  [EntryType.NPC_FEATURE]: `systems/Beacon/assets/icons/npc_feature.svg`,
  [EntryType.NPC_FEATURE + NpcFeatureType.Trait]: `systems/Beacon/assets/icons/trait.svg`,
  [EntryType.NPC_FEATURE + NpcFeatureType.Reaction]: `systems/Beacon/assets/icons/reaction.svg`,
  [EntryType.NPC_FEATURE + NpcFeatureType.System]: `systems/Beacon/assets/icons/system.svg`,
  [EntryType.NPC_FEATURE + NpcFeatureType.Weapon]: `systems/Beacon/assets/icons/weapon.svg`,
  [EntryType.NPC_FEATURE + NpcFeatureType.Tech]: `systems/Beacon/assets/icons/tech_full.svg`,
  [EntryType.NPC_TEMPLATE]: `systems/Beacon/assets/icons/npc_template.svg`,
  [EntryType.ORGANIZATION]: `systems/Beacon/assets/icons/encounter.svg`,
  [EntryType.PILOT]: `systems/Beacon/assets/icons/pilot.svg`,
  [EntryType.PILOT_ARMOR]: `systems/Beacon/assets/icons/role_tank.svg`,
  [EntryType.PILOT_GEAR]: `systems/Beacon/assets/icons/generic_item.svg`,
  [EntryType.PILOT_WEAPON]: `systems/Beacon/assets/icons/role_artillery.svg`,
  [EntryType.QUIRK]: `systems/Beacon/assets/icons/trait.svg`,
  [EntryType.RESERVE]: `systems/Beacon/assets/icons/reserve_tac.svg`,
  [EntryType.SITREP]: `systems/Beacon/assets/icons/compendium.svg`,
  [EntryType.SKILL]: `systems/Beacon/assets/icons/skill.svg`,
  [EntryType.STATUS]: `systems/Beacon/assets/icons/reticule.svg`,
  [EntryType.TAG]: `systems/Beacon/assets/icons/tag.svg`,
  [EntryType.TALENT]: `systems/Beacon/assets/icons/talent.svg`,
  [EntryType.WEAPON_MOD]: `systems/Beacon/assets/icons/weapon_mod.svg`,
  generic: GENERIC_ITEM_ICON,
};

// TODO: const MACRO_ICONS

export function TypeIcon(type: string, macro?: boolean): string {
  return DOCUMENT_ICONS[type] ?? DOCUMENT_ICONS["generic"];
}

// A substitution method that replaces the first argument IFF it is an img that we don't think should be preserved, and if the trimmed replacement string is truthy
export function replace_default_resource(current: string, replacement: string | null): string {
  // If no replacement, then obviously keep initial
  if (!replacement?.trim()) {
    return current;
  }

  // If empty or from system path or mystery man, replace
  if (!current?.trim() || current.includes("systems/Beacon") || current == "icons/svg/mystery-man.svg") {
    return replacement;
  }

  // Otherwise keep as is
  return current;
}
