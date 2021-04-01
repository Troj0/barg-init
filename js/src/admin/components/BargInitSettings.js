import ExtensionPage from 'flarum/common/components/ExtensionPage';
import { settings } from '@fof-components';

const {
    items: { BooleanItem, SelectItem, StringItem, NumberItem },
} = settings;

export default class BargInitSettings extends ExtensionPage {
    oninit(vnode) {
        super.oninit(vnode);

        this.setting = this.setting.bind(this);
    }

    // Not yet used. Planned for multi-select dropdown of tag selection
    getTags() {
        return app.store.all('tags').reduce((o, g) => {
            o[g.id()] = g.name();

            return o;
        }, {});
    }

 content() {
const tags = app.store.all('tags');

 return [
    <div className="container">
        <div className="BargInitSettingsPage">
            <div className="GeneralPreferences">
             <h3>{app.translator.trans('barg-init.admin.settings.title')}</h3>
             <div className="Form-group">
                 <BooleanItem setting={e} name="barg-init.allow_select_own_post" setting={this.setting}>
                     {app.translator.trans('barg-init.admin.settings.allow_select_own_post')}
                 </BooleanItem>
            </div>
            <div className="Form-group">
                 <BooleanItem setting={e} name="barg-init.use_alternative_ui" setting={this.setting}>
                     {app.translator.trans('barg-init.admin.settings.use_alt_ui')}
                </BooleanItem>
            </div>
            <hr />
            <div className="Reminders">
                 <h3>{app.translator.trans('barg-init.admin.settings.label.reminders')}</h3>
                 <p>
                 {app.translator.trans('barg-init.admin.settings.label.reminders_notice')}{' '}
                            <a href="https://discuss.flarum.org/d/24118" target="_blank">
                                Flarum Scheduler Info
                            </a> 
                 </p>
                 <div className="Form-group">
                 <NumberItem setting={e} name="barg-init.select_barg_init_reminder_days" placeholder="0" min="0" setting={this.setting}>
                     {app.translator.trans('barg-init.admin.settings.select_barg_init_reminder_days')}
                </NumberItem>
                 </div>
                 <div className="Form-group">
                    <StringItem setting={e} name="barg-init.remind_tag_ids" setting={this.setting}>
                        {app.translator.trans('barg-init.admin.settings.remind_tag_ids')}
                     </StringItem>
                     <ul>
                                {tags.map(function (tag) {
                                    return [
                                        <li>
                                            {tag.name()} <code>{tag.id()}</code>
                                        </li>,
                                    ];
                                })}
                            </ul>
                    </div>
                </div>
                <hr />
                <div className="AdvancedPreferences">
                <h3>{app.translator.trans('barg-init.admin.settings.label.advanced')}</h3>
                    <div className="Form-group">
                            <BooleanItem name="barg-init.schedule_on_one_server" setting={this.setting}>
                                {app.translator.trans('barg-init.admin.settings.schedule_on_one_server')}
                            </BooleanItem>
                    </div>
                    <div className="Form-group">
                            <BooleanItem name="barg-init.stop_overnight" setting={this.setting}>
                                {app.translator.trans('barg-init.admin.settings.schedule_stop_overnight')}
                            </BooleanItem>
                        </div>
                        <div className="Form-group">
                            <BooleanItem name="barg-init.store_log_output" setting={this.setting}>
                                {app.translator.trans('barg-init.admin.settings.schedule_log_output')}
                            </BooleanItem>
                        </div>
                        </div>
                    {this.submitButton()}
                </div>
            </div>,
            </div>,
        ];
    }
}
