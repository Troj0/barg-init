import Notification from 'flarum/common/components/Notification';

export default class BargInitInDiscussionNotification extends Notification {
    icon() {
        return 'fas fa-check';
    }

    href() {
        const notification = this.props.notification;
        const discussion = notification.subject();

        return app.route.discussion(discussion);
    }

    content() {
        const user = this.props.notification.fromUser();
        return app.translator.trans('barg-init.forum.notification.barg_init_in_discussion', {
            user: user,
        });
    }
}
