<svelte:options accessors={true} />

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { BeaconActor } from "../../actor/Beacon-actor";

  export let title: string;
  export let stat: "structure" | "stress";
  export let BeaconActor: BeaconActor | null;

  const dispatch = createEventDispatcher();

  function focus(el: HTMLElement) {
    el.focus();
  }

  function getCurrent(a: BeaconActor | null) {
    if (!a || (!a.is_mech() && !a.is_npc())) return 0;
    return Math.max(a.system.derived[stat].value - 1, 0);
  }

  function getDamage(a: BeaconActor | null) {
    if (!a || (!a.is_mech() && !a.is_npc())) return 0;
    return a.system.derived[stat].max - getCurrent(a);
  }

  $: icon = stat === "stress" ? ("reactor" as const) : stat;
  $: current = getCurrent(BeaconActor);
  $: damage = getDamage(BeaconActor);
</script>

<form
  id="structstress"
  class="structstress window-content"
  on:submit|preventDefault={() => {
    dispatch("submit");
  }}
>
  <div class="Beacon-header medium">
    <i class="cci cci-{icon} i--m i--light" />
    <span>{title}</span>
  </div>
  {#if BeaconActor && (BeaconActor.is_mech() || BeaconActor.is_npc())}
    <div class="message-body">
      <h3>{BeaconActor?.name ?? "UNKNOWN MECH"} has taken {icon} damage!</h3>
      <div class="damage-preview">
        {#each { length: current } as _}
          <i class="cci cci-{icon} i--m damage-pip" />
        {/each}
        {#each { length: damage } as _}
          <i class="mdi mdi-hexagon-outline i--m damage-pip damaged" />
        {/each}
      </div>
      <p class="message">
        Roll {damage}d6 to determine what happens.
      </p>
    </div>
  {/if}
  <div class="dialog-buttons flexrow">
    <button class="dialog-button submit default" data-button="submit" type="submit" use:focus>
      <i class="fas fa-check" />
      Roll
    </button>
    <button class="dialog-button cancel" data-button="cancel" type="button" on:click={() => dispatch("cancel")}>
      <i class="fas fa-times" />
      Cancel
    </button>
  </div>
</form>

<style>
  .message-body {
    margin: 8px 4px;
  }

  .damage-preview {
    text-align: center;
  }

  .damaged {
    opacity: 30%;
  }
</style>
