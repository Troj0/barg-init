import app from 'flarum/app';
import Component from 'flarum/Component';
import Model from 'flarum/Model';
export default class CommentField extends Component {
    init() {
        this.content = this.props.value;
    }    
    view() {
        return <input type="text" name="CommentBid" value={this.content} readonly></input>
    }
};