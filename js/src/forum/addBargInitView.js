import { extend } from 'flarum/common/extend';
import CommentPost from 'flarum/common/components/CommentPost';
import PostComponent from 'flarum/common/components/Post';
import PostMeta from 'flarum/common/components/PostMeta';
import username from 'flarum/common/helpers/username';
import userOnline from 'flarum/common/helpers/userOnline';
import Link from 'flarum/common/components/Link';

import SelectBargInitItem from './components/SelectBargInitItem';

export default () => {
    extend(CommentPost.prototype, 'headerItems', function(items) {
        const post = this.props.post;
        //const bidPost = post.attribute('alterbyteBidding');

        if (
            post.discussion().bargInitPost() && 
            post
                .discussion()
                .bargInitPost()
                .id() === post.id() &&
            !post.isHidden()
        ) {
            items.add(
                'isBargInit',
                SelectBargInitItem.component({
                    post,
                    discussion: post.discussion(),
                })
            );
        }
    });

    extend(CommentPost.prototype, 'footerItems', function(items) {
        const thisPost = this.props.post;
        const discussion = thisPost.discussion();
        const post = discussion.bargInitPost();
        const bidPostValueIsNotNull = this.props.post.attribute('alterbyteBidding') !== null;

        if (post && bidPostValueIsNotNull && !post.isHidden() && thisPost.number() === 1 && !thisPost.isHidden()) {
            const user = post.user();
            const bidPost = post.attribute('alterbyteBidding') + " ر.س";
            const approved = true;
            const isItapproved = approved === true ? 'approved' : 'NotApproved';

            items.add(
                `bargInitPost ${isItapproved}`,
                
                <div className="CommentPost">
                    <div className="Post-header">
                        <ul>
                            <li className="item-user">
                                <div className="PostUser">
                                    {user && userOnline(user)}
                                    <h3>
                                        {user ? (
                                            <a href={app.route.user(user)} config={m.route}>
                                                {username(user)}
                                            </a>
                                        ) : (
                                            username(user)
                                        )}
                                    </h3>
                                </div>
                            </li>
                            {post.discussion() && <li className="item-meta">{PostMeta.component({ post })}</li>}
                            {SelectBargInitItem.component({
                                post,
                                discussion,
                            })}
                        </ul>
                        <div Class="item-bid">
                            <input class="bidValue" type="text" name="CommentBid" value={bidPost} readonly></input>
                            </div>
                    </div>
                    <div className="Post-body">{m.trust(post.contentHtml())}
                    </div>
                    <div className="barg-footer">
                    <li className="item-confirm">
                        <button type="button">Confirm</button>
                        </li>
                    <li className="item-cancel">
                        <button type="button">Cancel</button>
                        </li>
                    </div>
                </div>,
                -10
            );
        }
    });

    extend(PostComponent.prototype, 'attrs', function(attrs) {
        const post = this.props.post;

        if (
            post.discussion().bargInitPost() &&
            post
                .discussion()
                .bargInitPost()
                .id() === post.id() &&
            !post.isHidden()
        ) {
            attrs.className += ' Post--bargInit';
        }
    });
};
