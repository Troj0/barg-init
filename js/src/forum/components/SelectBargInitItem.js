import Component from 'flarum/common/Component';
import icon from 'flarum/common/helpers/icon';
import humanTime from 'flarum/common/helpers/humanTime';
import Link from 'flarum/common/components/Link';

export default class SelectBargInitItem extends Component {
    view() {
        const { post, discussion } = this.attrs;

        return (
            <div className="Post--BargInit">
                {post ? (
                    <span>
                        {icon('fas fa-check')}
                        {app.translator.trans('barg-init.forum.sale_button')}
                    </span>
                ) : (
                    <a href={app.route.post(post)} config={m.route} data-number={post.number()}>
                        {icon('fas fa-check')}
                        {app.translator.trans('barg-init.forum.sale_button')}
                    </a>
                )}

                <span className="BargInit--User">
                    {app.translator.trans('barg-init.forum.sale_label', {
                        user: discussion.bargInitUser(),
                        time_set: this.getSetTime(discussion),
                        a: <a onclick={() => m.route(app.route.user(discussion.bargInitUser()))} />,
                    })}
                </span>
            </div>
        );
    }

    getSetTime(discussion) {
        if (discussion.bargInitSetAt() === null) {
            return;
        }
        return humanTime(discussion.bargInitSetAt());
    }
}
