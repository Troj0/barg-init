import { extend } from 'flarum/common/extend';
import app from 'flarum/common/app';
import Discussion from 'flarum/common/models/Discussion';
import Model from 'flarum/common/Model';
import NotificationGrid from 'flarum/common/components/NotificationGrid';

import SelectBargInitNotification from './components/SelectBargInitNotification';
import addBargInitAction from './addBargInitAction';
import addBargInitView from './addBargInitView';
import addBargInitBadge from './addBargInitBadge';
import AwardedBargInitNotification from './components/AwardedBargInitNotification';
import BargInitDiscussionNotification from './components/BargInitDiscussionNotification';

app.initializers.add('alterbyte/barg-init', () => {
    Discussion.prototype.bargInitPost = Model.hasOne('bargInitPost');
    Discussion.prototype.bargInitUser = Model.hasOne('bargInitUser');
    Discussion.prototype.hasBargInit = Model.attribute('hasBargInit');
    Discussion.prototype.startUserId = Model.attribute('startUserId', Number);
    Discussion.prototype.firstPostId = Model.attribute('firstPostId', Number);
    Discussion.prototype.canSelectBargInit = Model.attribute('canSelectBargInit');
    Discussion.prototype.bargInitSetAt = Model.attribute('bargInitSetAt', Model.transformDate);

    app.notificationComponents.selectBargInit = SelectBargInitNotification;
    app.notificationComponents.awardedBargInit = AwardedBargInitNotification;
    app.notificationComponents.BargInitInDiscussion = BargInitDiscussionNotification;

    addBargInitBadge();
    addBargInitAction();
    addBargInitView();

    extend(NotificationGrid.prototype, 'notificationTypes', function(items) {
        items.add('awardedBargInit', {
            name: 'awardedBargInit',
            icon: 'fas fa-check',
            label: app.translator.trans('barg-init.forum.notification.preferences.awarded_barg_init'),
        });
        items.add('BargInitInDiscussion', {
            name: 'BargInitInDiscussion',
            icon: 'fas fa-check',
            label: app.translator.trans('barg-init.forum.notification.preferences.barg_init_in_discussion'),
        });
    });
});