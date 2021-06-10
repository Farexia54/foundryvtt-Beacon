import { EntryType, License, LicensedItem, LiveEntryTypes, OpCtx, Pilot, RegEntry, Registry, RegRef } from "machine-mind";
import { is_actor_type, LancerActor, LancerActorType, LancerMech, LancerPilot } from "../actor/lancer-actor";
import { PACK_SCOPE } from "../compBuilder";
import { friendly_entrytype_name } from "../config";
import { LancerItem, LancerItemType } from "../item/lancer-item";
import { FoundryFlagData, FoundryReg, FoundryRegCat } from "./foundry-reg";

// Simple caching mechanism for handling async fetchable values for a certain length of time
export class FetcherCache<A, T> {
  // The currently cached value
  private cached_values: Map<A, Promise<T>> = new Map();
  private cached_resolved_values: Map<A, T> = new Map();

  // Holds the expiration time of specified keys. Repeated access will keep alive for longer
  private timeout_map: Map<A, number> = new Map();

  constructor(private readonly timeout: number | null) {}

  // Call this on a key to check if it has timed out
  private refresh_timeout(key: A) {
    if (this.timeout) {
      let now = Date.now();
      this.timeout_map.set(key, now + this.timeout);
    }
  }

  // Fetch the value using the specified key. If not present, resolves it using the specified function
  async fetch(arg: A, fetch_func: (arg: A) => Promise<T>): Promise<T> {
    let now = Date.now();

    // Refresh the lookup on our target value (or set it for the first time, depending) ((if we have a timeout))
    this.refresh_timeout(arg);
    this.cleanup();

    // Check if we have cached data. If so, yield. If not, create
    let cached = this.cached_values.get(arg);
    if (cached) {
      return cached;
    } else {
      let new_val_promise = fetch_func(arg);
      this.cached_values.set(arg, new_val_promise);
      new_val_promise.then(resolved => this.cached_resolved_values.set(arg, resolved));
      return new_val_promise;
    }
  }

  // Fetch the value iff it is currently cached. Essentially a no-cost peek, useful for editing the cached val without doing a full re-fetch
  soft_fetch(arg: A): T | null {
    let rv = this.cached_resolved_values.get(arg) ?? null;
    if(rv != null) {
      this.refresh_timeout(arg); 
    }
    return rv;
  }

  // Destroys all entries that should be destroyed
  private cleanup() {
    if(!this.timeout) return;
    let now = Date.now();
    for (let [arg, expire] of this.timeout_map.entries()) {
      if (expire < now) {
        this.timeout_map.delete(arg);
        this.cached_values.delete(arg);
      }
    }
  }

  // Destroy a particular set of cached values
  public flush(arg: A) {
    this.cached_values.delete(arg);
    this.cached_resolved_values.delete(arg);
    this.timeout_map.delete(arg);
  }

  // Destroy all entries, period.
  public flush_all() {
    this.cached_values.clear();
    this.cached_resolved_values.clear();
    this.timeout_map.clear();
  }
}

export async function mm_wrap_item<T extends EntryType & LancerItemType>(
  item: LancerItem<T>,
  use_existing_ctx: OpCtx
): Promise<LiveEntryTypes<T>> {
  // Get the reg that'd hold this item
  let reg: FoundryReg;

  // @ts-ignore 0.8
  if (item.parent != null) {
    // We are an owned item
    // @ts-ignore 0.8
    if(item.pack != null) {
      // A compendium actor owned item
      reg = new FoundryReg({
        src: "comp_actor",
        // @ts-ignore 0.8
        comp_id: item.pack,
        // @ts-ignore 0.8
        actor_id: item.actor.id,
      });
      //@ts-ignore 0.8
    } else if(item.parent.isToken) {
      // A token actor owned item
      reg = new FoundryReg({
        src: "scene_token",
        // @ts-ignore 0.8
        scene_id: item.actor.token.parent.id,
        // @ts-ignore 0.8
        token_id: item.actor.token.id
      });
    } else {
      // A world actor owned item
      reg = new FoundryReg({
        src: "game_actor",
        // @ts-ignore 0.8
        actor_id: item.actor.id,
      });
    }
  } else {
    // We are an unowned item
    // @ts-ignore 0.8
    if(item.pack != null) {
      // An unowned compendium item
      // @ts-ignore 0.8
      if(is_core_pack_name(item.pack)) {
        // An unowned core compendium item
        reg = new FoundryReg({
          src: "comp_core"
        });
      } else {
        // An unowned custom compendium item
        reg = new FoundryReg({
          src: "comp",
          // @ts-ignore 0.8
          comp_id: item.pack
        });
      }
    } else {
      // An unowned game item
      reg = new FoundryReg({
        src: "game"
      });
    }
  }
  
  let ctx = use_existing_ctx || new OpCtx();

  // Load up the item. This _should_ always work
  // let ent = (await reg.get_cat(item.type).get_live(ctx, item.id)) as LiveEntryTypes<T>;
  let cat = reg.get_cat(item.data.type) as FoundryRegCat<T>;
  let ent = (await cat.dangerous_wrap_doc(ctx, item as any)) as LiveEntryTypes<T>; // Poor typescript doesn't know how to handle these
  if (!ent) {
    throw new Error("Something went wrong while trying to wrap an item...");
  }
  return ent;
}

export async function mm_wrap_actor<T extends EntryType & LancerActorType>(
  actor: LancerActor<T>,
  use_existing_ctx: OpCtx
): Promise<LiveEntryTypes<T>> {
  // Get our reg. Thankfully simpler than mm_wrap_item since we don't really need to worry as much about parent
  let reg: FoundryReg;
  if (actor.isToken) {
    // Is a token actor. Note that we aren't trying to get its inventory, so we leave it at the scene scope, not scene_token
    reg = new FoundryReg({
      src: "scene",
      // @ts-ignore 0.8
      scene_id: actor.token.parent.id,
    });
  // @ts-ignore 0.8
  } else if (actor.pack) {
    // Is a compendium actor. Note that we aren't trying to get its inventory, so we leave it at the compendium scope
    // @ts-ignore 0.8
    if(is_core_pack_name(actor.pack)) {
      // Is core
      reg = new FoundryReg({
        src: "comp_core"
      });
    } else {
      // Is non-core
      reg = new FoundryReg({
        src: "comp",
        // @ts-ignore 0.8
        comp_id: actor.pack
      });
    }
  } else {
    // Is a game actor. Note that we aren't trying to get its inventory, so we leave it at game scope
    reg = new FoundryReg({
      src: "game"
    });
  }
  let ctx = use_existing_ctx || new OpCtx();

  // let ent = (await reg.get_cat(actor.data.type).get_live(ctx, id)) as LiveEntryTypes<T>;
  let cat = reg.get_cat(actor.data.type) as FoundryRegCat<T>;
  let ent = (await cat.dangerous_wrap_doc(ctx, actor as any)) as LiveEntryTypes<T>; // Poor typescript doesn't know how to handle these
  if (!ent) {
    throw new Error("Something went wrong while trying to contextualize an actor...");
  }

  return ent;
}

// Define a helper to check if a license includes the specified item. Checks by lid. Maybe change that in the future?
// export function license_has(license: License, item: LiveEntryTypes<LancerItemType>) {
// return license.FlatUnlocks.some(unlockable => unlockable.LID == (item as any).LID);
// }

// Helper for finding what license an item comes from. Checks by name, an inelegant solution but probably good enough
export async function find_license_for(
  mm: LiveEntryTypes<LancerItemType>,
  in_actor?: LancerMech | LancerPilot
): Promise<License | null> {
  // If the item does not have a license name, then we just bail
  let license_name = (mm as LicensedItem).License;
  if (!license_name) {
    return null;
  }

  // If an actor was supplied, we first check their inventory.
  if (in_actor) {
    let actor_mm = await in_actor.data.data.derived.mm_promise;

    // Only pilots should have licenses, so for mechs we go to active pilot
    let pilot: Pilot | null = null;
    if (actor_mm.Type == EntryType.MECH) {
      pilot = actor_mm.Pilot;
    }

    // Check pilot inventory, in case they have a weird custom license
    if (pilot) {
      let found = pilot.Licenses.find(lic => lic.LicenseKey == license_name);
      if (found) {
        return found;
      }
    }
  }

  // Actor was a bust. Try global
  return world_and_comp_license_cache.fetch(license_name);
}

// The cache to implement the above. Doesn't need to last long - this just happens in bursts
// Just keeps track of license refs by name
const world_and_comp_license_cache = new FetcherCache<string, License | null>(
  60_000,
  async license_name => {
    let ctx = new OpCtx();
    let world_reg = new FoundryReg("game");
    let world_license = await world_reg.get_cat(EntryType.LICENSE).lookup_live(ctx, {key: license_name});
    if (world_license.length) {
      return world_license[0];
    }

    // Ok. Try core compendium. This is most likely to be where it is, but best to try world first
    let compendium_reg = new FoundryReg("comp_core");
    let compendium_license = await compendium_reg.get_cat(EntryType.LICENSE).lookup_live(ctx, {key: license_name});
    if(compendium_license.length) {
      return compendium_license[0];
    }

    // Oh well!
    console.log(`Did not find ${license_name} in world/core compendium. Note that external compendiums are not (yet) scanned as part of this procedure`);
    return null;
  }
);


// Get the owner of an item, or null if none exists
export function mm_owner<T extends LancerItemType>(item: RegEntry<T>): LancerActor<LancerActorType> | null {
    let flags = item.Flags as FoundryFlagData<T>;
    let owner = flags.orig_doc.actor;
    if(owner) {
      return owner as LancerActor<LancerActorType>;
    } else {
      return null;
    }
}

// Returns true if this is one of the packs thats controlled by get_pack
export function is_core_pack_name(name: string): boolean {
  // Cut off leading stuff before .
  let imp = name.substr(name.indexOf(".") + 1);

  // Is it an entry type?
  for(let e of Object.values(EntryType)) {
    if(e == imp) {
      return true;
    }
  }
  return false;
}

// Lists all packs of specified type that aren't in the core pack. We cache this. Can clear cache by setting v to null
const cached_alt_packs = { 
  Item: null as any,
  Actor: null as any
};

export function get_secondary_packs(doc_type: "Actor" | "Item"): any[] {
  if(cached_alt_packs[doc_type] == null) {
    // Get all packs of items
    // @ts-ignore 0.8
    let candidates = game.packs.contents.filter(p => p.documentName == doc_type).map(p => p.collection) as string[];

    // Remove all that are just a core pack, and store
    cached_alt_packs[doc_type] = candidates.filter(name => !is_core_pack_name(name));
  }
  return cached_alt_packs[doc_type];
}

// Information about a pack
interface PackMetadata {
  name: string;
  label: string;
  system: "lancer";
  package: "world";
  path: string; // "./packs/skills.db",
  entity: "Item" | "Actor";
}

// Get a pack id
export function get_pack_id(type: EntryType): string {
  return `${PACK_SCOPE}.${type}`;
}

// Retrieve a pack, or create it as necessary
// async to handle the latter case
export async function get_pack(type: LancerItemType | LancerActorType): Promise<Compendium> {
  let pack: Compendium | undefined;

  // Find existing world compendium
  pack = game.packs.get(get_pack_id(type));
  if (pack) {
    return pack;
  } else {
    // Compendium doesn't exist yet. Create a new one.
    // Create our metadata
    const entity_type = is_actor_type(type) ? "Actor" : "Item";
    const metadata: PackMetadata = {
      name: type,
      entity: entity_type,
      label: friendly_entrytype_name(type),
      system: "lancer",
      package: "world",
      path: `./packs/${type}.db`,
    };

    //@ts-ignore .8
    return CompendiumCollection.createCompendium(metadata);
  }
}
