import { populatePilotCache } from "../compcon";

export default class CompconLoginForm extends FormApplication {
  constructor(object: any, options = {}) {
    super(object, options);
  }
  static get defaultOptions(): FormApplication.Options {
    return {
      ...super.defaultOptions,
      template: `systems/${game.system.id}/templates/window/compcon_login.hbs`,
      width: 480,
      height: "auto",
      resizable: false,
      classes: ["Beacon"],
      submitOnChange: false,
      submitOnClose: false,
      closeOnSubmit: false,
      title: "COMP/CON Login",
    };
  }

  /** @override */
  async _updateObject(_event: any, formData: any) {
    try {
      const { Auth } = await import("@aws-amplify/auth");
      let res = await Auth.signIn(formData.username, formData.password);
      ui.notifications!.info("Logged in as " + res.attributes.email);
      // we have a fresh login token, let's populate the pilot cache
      // no need to block on it, it can happen in the background
      populatePilotCache();
      return this.close();
    } catch (e) {
      // AWS-amplify doesn't throw Errors for no apparent reason so ignore types and try our best
      ui.notifications!.error(`Could not log in to Comp/Con: ${(e as any)?.message ?? e}`);
      console.error(e);
    }
  }
}
