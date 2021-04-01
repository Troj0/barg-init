import Notification from 'flarum/common/components/Notification';

export default class SelectBargInitNotification extends Notification {
    icon() {
        return 'fas fa-comment-dots';
    }

    href() {
        const notification = this.props.notification;
        const discussion = notification.subject();

        return app.route.discussion(discussion);
    }

    content() {
        return app.translator.trans('barg-init.forum.notification.content');
    }
}
