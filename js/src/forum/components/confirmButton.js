import Component from 'flarum/common/Component';
import icon from 'flarum/common/helpers/icon';
import humanTime from 'flarum/common/helpers/humanTime';
import Link from 'flarum/common/components/Link';
import Button from 'flarum/common/components/Button';

export default class confirmButton extends Component {
    view() {
        const { post, discussion } = this.attrs;

        return (
            m( 'bargInit-dle-confirm',
            Button.component({ 
                textContent: 'Approve',
                //icon: `fa${isBargInit ? 's' : 'r'} fa-comment-dots`,
                onclick: () => {
                    

                    saveDiscussion(discussion, isBargInit, post);
                },
            },
            //actionLabel(isBargInit)
            ))
        );
    }
}