import Modal from '../../common/components/Modal';
import ForgotPasswordModal from './ForgotPasswordModal';
import SignUpModal from './SignUpModal';
import Button from '../../common/components/Button';
import LogInButtons from './LogInButtons';
import extractText from '../../common/utils/extractText';
import ItemList from '../../common/utils/ItemList';
import Stream from '../../common/utils/Stream';

/**
 * The `LogInModal` component displays a modal dialog with a login form.
 *
 * ### Attrs
 *
 * - `identification`
 * - `password`
 */
export default class LogInModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);
  }

  className() {
    return 'LogInModal Mosdal--small';
  }

  title() {
    //return app.translator.trans('core.forum.log_in.title');
  }

  content() {
    return [<div className="Modal-body">{this.body()}</div>, <div className="Modal-footer">{this.footer()}</div>];
  }

  body() {
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

  fields() {
    const items = new ItemList();

    items.add(
      'identification',
      <div className="Form-group">
        <input
          className="FormControl"
          name="identification"
          type="text"
          placeholder={extractText(app.translator.trans('core.forum.log_in.username_or_email_placeholder'))}
          bidi={this.identification}
          disabled={this.loading}
        />
      </div>,
      30
    );

    items.add(
      'password',
      <div className="Form-group">
        <input
          className="FormControl"
          name="password"
          type="password"
          placeholder={extractText(app.translator.trans('core.forum.log_in.password_placeholder'))}
          bidi={this.password}
          disabled={this.loading}
        />
      </div>,
      20
    );

    items.add(
      'remember',
      <div className="Form-group">
        <div>
          <label className="checkbox">
            <input type="checkbox" bidi={this.remember} disabled={this.loading} />
            {app.translator.trans('core.forum.log_in.remember_me_label')}
          </label>
        </div>
      </div>,
      10
    );

    items.add(
      'submit',
      <div className="Form-group">
        {Button.component(
          {
            className: 'Button Button--primary Button--block',
            type: 'submit',
            loading: this.loading,
          },
          
        )}
      </div>,
      -10
    );

    return items;
  }
}
