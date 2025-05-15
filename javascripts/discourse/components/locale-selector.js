import Component from "@ember/component";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { ajax } from "discourse/lib/ajax";
import { userPath } from "discourse/lib/url";
import { isTesting } from "discourse-common/config/environment";

export default class LocaleSelector extends Component {
  @service currentUser;
  @service siteSettings;

  get availableLocales() {
    const allLocales = JSON.parse(this.siteSettings.available_locales);
    // Filter to only allow English (en) and French (fr)
    return allLocales.filter(locale => ["en", "fr"].includes(locale.value));
  }

  @action
  onChangeLocale(value) {
    this.set("currentUser.locale", value);
    ajax(userPath(`${this.currentUser.username_lower}.json`), {
      data: { locale: this.currentUser.locale },
      type: "PUT",
    }).then((val) => {
      if (!isTesting()) {
        location.reload();
      }
    });
  }
  
  defaultItem() {
    const currentUserLocale = document.documentElement
      .getAttribute("lang")
      ?.replaceAll("-", "_");

    return (
      this.content.find((val) => val.value === currentUserLocale) ||
      this.content.find((val) => val.value === this.siteSettings.default_locale)
    );
  }
}
