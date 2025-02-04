import { getTrackerAppearance } from "Beacon-initiative";
type Appearance = NonNullable<typeof CONFIG.BeaconInitiative.def_appearance>;

export class BeaconCombatTrackerConfig extends CombatTrackerConfig<
  FormApplication.Options,
  ClientSettings.Values["Beacon.combatTrackerConfig"]
> {
  static get defaultOptions(): FormApplication.Options {
    return {
      ...super.defaultOptions,
      template: `systems/${game.system.id}/templates/combat/combat-tracker-config.hbs`,
    };
  }

  async getData(options?: Partial<FormApplication.Options>) {
    const data = await super.getData(options);
    data.settings.sortTracker = game.settings.get(game.system.id, "combat-tracker-sort");
    return data;
  }

  activateListeners(html: JQuery<HTMLElement>) {
    html.find("button#tracker-appearance").on("click", () => new BeaconCombatAppearanceConfig({}).render(true));
  }

  async _updateObject(
    event: Event,
    formData: ClientSettings.Values["Beacon.combatTrackerConfig"]
  ): Promise<ClientSettings.Values["core.combatTrackerConfig"]> {
    let res = await super._updateObject(event, formData);
    console.log(formData);
    await game.settings.set(game.system.id, "combat-tracker-sort", formData["sortTracker"]);
    return res;
  }
}

/**
 * Settings form for customizing the icon appearance of the icon used in the
 * tracker
 */
class BeaconCombatAppearanceConfig extends FormApplication<FormApplication.Options, Appearance> {
  static get defaultOptions(): FormApplication.Options {
    return {
      ...super.defaultOptions,
      title: "Beacon Intiative",
      id: "Beacon-initiative-settings",
      template: `systems/${game.system.id}/templates/combat/Beacon-initiative-settings.hbs`,
      width: 350,
    };
  }

  getData(): Appearance {
    return getTrackerAppearance();
  }

  activateListeners(html: JQuery<HTMLElement>): void {
    super.activateListeners(html);

    //update the preview icon
    html.find('input[name="icon"]').on("change", e => {
      html
        .find("a.preview")
        .removeClass()
        .addClass($(e.target).val() + " preview");
    });

    // Update the preview icon size
    html.find('input[name="icon_size"]').on("change", e => {
      html.find("a.preview").css("font-size", $(e.target).val() + "rem");
    });

    // Set the preview icon color to the last hovered color picker
    html.find('input[type="color"]').on("mouseenter mouseleave", e => {
      html.find("a.preview").css("color", $(e.target).val() as string);
      if ($(e.target).attr("name") === "done_selector") return;
      html.find("li.combatant").css("border-color", $(e.target).val() as string);
    });

    html.find('button[name="reset"]').on("click", this.resetSettings.bind(this));
  }

  async _updateObject(_: Event, data: Record<string, unknown>): Promise<void> {
    const config = CONFIG.BeaconInitiative;
    game.settings.set(
      config.module,
      "combat-tracker-appearance",
      foundry.utils.diffObject(config.def_appearance!, data, { inner: true })
    );
  }

  /**
   * Sets all settings handled by the form to undefined in order to revert to
   * their default values.
   */
  async resetSettings(): Promise<unknown> {
    const config = CONFIG.BeaconInitiative;
    await game.settings.set(config.module, "combat-tracker-appearance", {});
    return this.render();
  }
}
