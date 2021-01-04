import { extend } from 'flarum/extend';
import PermissionGrid from 'flarum/components/PermissionGrid';
import { settings } from '@fof-components';

const {
    SettingsModal,
    items: { BooleanItem, NumberItem, StringItem },
} = settings;

app.initializers.add('alterbyte/barg-init', () => {
    app.extensionSettings['barg-init'] = () =>
        app.modal.show(SettingsModal, {
            title: app.translator.trans('barg-init.admin.settings.title'),
            type: 'small',
            items: e => [
                <BooleanItem setting={e} name="barg-init.allow_select_own_post">
                    {app.translator.trans('barg-init.admin.settings.allow_select_own_post')}
                </BooleanItem>,
                <BooleanItem setting={e} name="barg-init.use_alternative_ui">
                    {app.translator.trans('barg-init.admin.settings.use_alt_ui')}
                </BooleanItem>,
                <NumberItem setting={e} name="barg-init.select_barg_init_reminder_days" min="0" placeholder="0">
                    {app.translator.trans('barg-init.admin.settings.select_barg_init_reminder_days')}
                </NumberItem>,
                <StringItem setting={e} name="barg-init.remind_tag_ids">
                    {app.translator.trans('barg-init.admin.settings.remind_tag_ids')}
                </StringItem>,
                <BooleanItem setting={e} name="barg-init.schedule_on_one_server">
                    {app.translator.trans('barg-init.admin.settings.schedule_on_one_server')}
                </BooleanItem>,
                <BooleanItem setting={e} name="barg-init.stop_overnight">
                    {app.translator.trans('barg-init.admin.settings.schedule_stop_overnight')}
                </BooleanItem>,
                <BooleanItem setting={e} name="barg-init.store_log_output">
                    {app.translator.trans('barg-init.admin.settings.schedule_log_output')}
                </BooleanItem>,
            ],
        }
        );

    extend(PermissionGrid.prototype, 'replyItems', function (items) {
        items.add('selectBargInit', {
            icon: 'far fa-comment',
            label: app.translator.trans('barg-init.admin.permissions.barg_init'),
            permission: 'discussion.selectBargInitOwnDiscussion',
        });

        items.add('selectBestAnswerNotAuthor', {
            icon: 'far fa-comment',
            label: app.translator.trans('barg-init.admin.permissions.barg_init_not_own_discussion'),
            permission: 'discussion.selectBargInitNotOwnDiscussion',
        });
    });
});