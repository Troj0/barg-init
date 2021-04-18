import Component from 'flarum/common/Component';
import icon from 'flarum/common/helpers/icon';
import humanTime from 'flarum/common/helpers/humanTime';
import Link from 'flarum/common/components/Link';
import Button from 'flarum/common/components/Button';
import PostMeta from 'flarum/common/components/PostMeta';
import DiscussionPage from 'flarum/common/components/DiscussionPage';


export default class cancelButton extends Component {
    view() {
        const { post, discussion } = this.attrs;
        const isThisBargInit = (discussion, post) => {
            return discussion.bargInitPost() && discussion.bargInitPost().id() === post.id();
        };

        let isBargInit = isThisBargInit(discussion, post);
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
                        app.current.get('stream').update();
                    }
    
                    m.redraw();
    
                    if (isBargInit) {
                        m.route.set(app.route.discussion(discussion));
                    }
                });
        };
            return (
                m( 'bargInit-dle-cancel',
                Button.component({ 
                    textContent: 'Cancel',
                    onclick: () => {
                        
                        isBargInit = !isBargInit;
                        
    
                        saveDiscussion(discussion, isBargInit, post);
                    },
                },
                //actionLabel(isBargInit)
                ))
            );
        //}
        
    }
}