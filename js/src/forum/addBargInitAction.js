import { extend } from 'flarum/common/extend';
import Button from 'flarum/common/components/Button';
import PostControls from 'flarum/common/utils/PostControls';
import DiscussionPage from 'flarum/common/components/DiscussionPage';
import CommentPost from 'flarum/common/components/CommentPost';

export default () => {
    const ineligible = (discussion, post) => {
        return post.isHidden() || post.attribute('alterbyteBidding') === null || post.number() === 1 || !discussion.canSelectBargInit() || !app.session.user
    };

    const blockSelectOwnPost = (post) => {
        return !app.forum.attribute('canSelectBargInitOwnPost') && post.user() && post.user().id() === app.session.user.id();
    };

    const isThisBargInit = (discussion, post) => {
        return discussion.bargInitPost() && discussion.bargInitPost().id() === post.id();
    };

    const actionLabel = (isBargInit) => {
        return app.translator.trans(isBargInit ? 'barg-init.forum.remove_barg_init' : 'barg-init.forum.this_barg_init');
    };

    const saveDiscussion = (discussion, isBargInit, post) => {
        discussion
            .save({
                bargInitPostId: isBargInit ? post.id() : 0,
                bargInitUserId: app.session.user.id(),
                relationships: isBargInit
                    ? { bargInitPost: post, bargInitUser: app.session.user }
                    : delete discussion.data.relationships.bargInitPost,
            })
            .then(() => {
                if (app.current instanceof DiscussionPage) {
                    app.current.stream.update();
                }

                m.redraw();

                if (isBargInit) {
                    m.route(app.route.discussion(discussion));
                }
            });
    };

    extend(PostControls, 'moderationControls', function (items, post) {
        if (app.forum.attribute('useAlternativeBargInitUi')) return;

        const discussion = post.discussion();
        let isBargInit = isThisBargInit(discussion, post);

        post.pushAttributes({ isBargInit });

        if (post.contentType() !== 'comment') return;

        if (ineligible(discussion, post) || blockSelectOwnPost(post)) return;

        items.add(
            'bargInit-dle',
            Button.component({
                children: actionLabel(isBargInit),
                icon: `fa${isBargInit ? 's' : 'r'} fa-comment-dots`,
                onclick: () => {
                    isBargInit = !isBargInit;

                    saveDiscussion(discussion, isBargInit, post);
                },
            })
        );
    });

    extend(CommentPost.prototype, 'actionItems', function (items) {
        if (!app.forum.attribute('useAlternativeBargInitUi')) return;

        const post = this.props.post;
        const discussion = this.props.post.discussion();
        let isBargInit = isThisSale(discussion, post);
        let hasBargInit = discussion.bargInitPost() !== false;

        post.pushAttributes({ isBargInit });

        if (ineligible(discussion, post) || blockSelectOwnPost(post)) return;

        items.add(
            'bargInit',
            Button.component({
                children: actionLabel(isBargInit),
                className: !hasBargInit ? 'Button Button--primary' : (isBargInit ? 'Button Button--primary' : 'Button Button--link'),
                onclick: function onclick() {
                    hasBargInit = !hasBargInit;
                    isBargInit = !isBargInit;

                    saveDiscussion(discussion, isBargInit, post);
                },
            })
        );
    });
};
