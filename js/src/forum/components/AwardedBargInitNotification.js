import Notification from 'flarum/common/components/Notification';

export default class AwardedBargInitNotification extends Notification {
    icon() {
        return 'fas fa-check';
    }

    href() {
        const notification = this.attrs.notification;
        const discussion = notification.subject();

        return app.route.discussion(discussion);
    }

    content() {
        const user = this.attrs.notification.fromUser();
        return app.translator.trans('barg-init.forum.notification.awarded', {
            user: user,
        });
    }
}
