import { extend } from 'flarum/extend';
import CommentPost from 'flarum/components/CommentPost';
import PostComponent from 'flarum/components/Post';
import PostMeta from 'flarum/components/PostMeta';
import username from 'flarum/helpers/username';
import userOnline from 'flarum/helpers/userOnline';

import SelectBargInitItem from './components/SelectBargInitItem';

export default () => {
    extend(CommentPost.prototype, 'headerItems', function(items) {
        const post = this.attrs.post; //change
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
        const thisPost = this.attrs.post; //change
        const discussion = thisPost.discussion();
        const post = discussion.bargInitPost();
        const bidPostValueIsNotNull = this.attrs.post.attribute('alterbyteBidding') !== null; //change

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

    extend(PostComponent.prototype, 'elementAttrs', function(elementAttrs) { //change
        const post = this.attrs.post; //change

        if (
            post.discussion().bargInitPost() &&
            post
                .discussion()
                .bargInitPost()
                .id() === post.id() &&
            !post.isHidden()
        ) {
            elementAttrs.className += ' Post--bargInit'; //change
        }
    });
};
