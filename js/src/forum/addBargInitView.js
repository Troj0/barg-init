import { extend } from 'flarum/common/extend';
import CommentPost from 'flarum/common/components/CommentPost';
import PostComponent from 'flarum/common/components/Post';
import PostMeta from 'flarum/common/components/PostMeta';
import username from 'flarum/common/helpers/username';
import userOnline from 'flarum/common/helpers/userOnline';
import Link from 'flarum/common/components/Link';
import Button from 'flarum/common/components/Button';

import SelectBargInitItem from './components/SelectBargInitItem';
import confirmButton from './components/confirmButton';
import cancelButton from './components/cancelButton';

export default () => {
    extend(CommentPost.prototype, 'headerItems', function(items) {
        const post = this.attrs.post;
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
        //let isBargInit = isThisBargInit(discussion, post);
        const thisPost = this.attrs.post;
        const discussion = thisPost.discussion();
        const post = discussion.bargInitPost();
        //this.attrs.post.data.relationships.user.data.id
        
       //const firstPost = this.attrs.post.number() === 1;
        
       //Make the author var
        const firstPost = thisPost.number() === 1;
        const firstPostUserId = firstPost === true ? this.attrs.post.data.relationships.user.data.id : null;
        const discussionAuthor = firstPostUserId ;
        //***   

        //Make the bargInituser var
        if(discussion.bargInitPost()){
            this.bargInitUser = discussion.bargInitPost().data.relationships.user.data.id;
            }
        //*** 
        if(app.session.user){
            this.appSeassionUser = app.session.user.data.id;
        }
        
        const notbargInitUser = this.appSeassionUser != this.bargInitUser;
        if(firstPostUserId != null){
            this.notAuthor = this.appSeassionUser != discussionAuthor;
        }
        
        const guest = notbargInitUser && this.notAuthor;
        const bidPostValueIsNotNull = this.attrs.post.attribute('alterbyteBidding') !== null;

        // will not apear to barginit user nor the discussion author
        if (post && bidPostValueIsNotNull && !post.isHidden() && thisPost.number() === 1 && !thisPost.isHidden() && notbargInitUser && this.notAuthor) {
            const user = post.user();
            const bidPost = post.attribute('alterbyteBidding');
            if(typeof(bidPost) != "undefined"){
                this.bidPost = post.attribute('alterbyteBidding') + " ر.س";
            }
            else{
                this.bidPost = 'Please login to see bid'
            }
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
                            <input class="bidValue" type="text" name="CommentBid" value={this.bidPost} readonly></input>
                            </div>
                    </div>
                    <div className="Post-body">{m.trust(post.contentHtml())}
                    </div>
                    <div className="barg-footer">
                    <li className="item-confirm">
                        
                        </li>
                    <li className="item-cancel">
                        
                        </li>
                    </div>
                </div>,
                -10
                
            );
        }
        // will apear only to barginit user

        if (post && bidPostValueIsNotNull && !post.isHidden() && thisPost.number() === 1 && !thisPost.isHidden() && this.notAuthor && !guest) {
            const user = post.user();
            const bidPost = post.attribute('alterbyteBidding') + " ر.س";
            if(bidPost !== null){
                this.bidPost = post.attribute('alterbyteBidding') + " ر.س";
            }
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
                            <input class="bidValue" type="text" name="CommentBid" value={this.bidPost} readonly></input>
                            </div>
                    </div>
                    <div className="Post-body">{m.trust(post.contentHtml())}
                    </div>
                    <div className="barg-footer">
                    <li className="item-confirm">
                        {confirmButton.component({
                            post,
                            discussion,
                        })}
                        </li>
                    <li className="item-cancel">
                    {cancelButton.component({
                            post,
                            discussion,
                        })}
                        </li>
                    </div>
                </div>,
                -10
            );
        }
        // will apear only to the discussion author
        if (post && bidPostValueIsNotNull && !post.isHidden() && thisPost.number() === 1 && !thisPost.isHidden() && notbargInitUser && !guest) {
            const user = post.user();
            const bidPost = post.attribute('alterbyteBidding') + " ر.س";
            if(bidPost !== null){
                this.bidPost = post.attribute('alterbyteBidding') + " ر.س";
            }
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
                            <input class="bidValue" type="text" name="CommentBid" value={this.bidPost} readonly></input>
                            </div>
                    </div>
                    <div className="Post-body">{m.trust(post.contentHtml())}
                    </div>
                    <div className="barg-footer">
                    <li className="item-confirm">
                        </li>   
                    <li className="item-cancel">
                    {cancelButton.component({
                            post,
                            discussion,
                        })}
                        </li>
                    </div>
                </div>,
                -10
            );
        }
        
    }
    
    );

    extend(PostComponent.prototype, 'attrs', function(attrs) {
        const post = this.attrs.post;

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
