import Component from 'flarum/Component';
import icon from 'flarum/helpers/icon';
import humanTime from 'flarum/helpers/humanTime';

export default class SelectBargInitItem extends Component {
    view() {
        const { post, discussion } = this.props;

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
