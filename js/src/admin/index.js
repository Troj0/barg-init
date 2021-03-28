import { settings } from '@fof-components';
import app from 'flarum/app';
import BargInitSettings from './components/BargInitSettings';
const {
    SettingsModal,
    items: { BooleanItem, NumberItem, StringItem },
} = settings;

app.initializers.add('alterbyte/barg-init', () => {
    app.extensionData
        .for('barg-init')
        .registerPage(BargInitSettings)
        .registerPermission(
            {
                icon: 'far fa-comment',
                label: app.translator.trans('barg-init.admin.permissions.best_answer'),
                permission: 'discussion.selectBargInitOwnDiscussion',
            },
            'reply'
        )
        .registerPermission(
            {
                icon: 'far fa-comment',
                label: app.translator.trans('barg-init.admin.permissions.best_answer_not_own_discussion'),
                permission: 'discussion.selectBargInitNotOwnDiscussion',
            },
            'reply'
        );
    
});