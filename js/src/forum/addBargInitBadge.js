import app from 'flarum/app';
import { extend } from 'flarum/extend';
import Badge from 'flarum/components/Badge';
import Discussion from 'flarum/models/Discussion';

//adding badge on Discussion Hero / and on discussion list
export default function() {
    extend(Discussion.prototype, 'badges', function(items) {
        if (this.hasBargInit() && !items.has('hidden')) {
            items.add(
                'barg-init-badge',
                Badge.component({
                    type: 'bargInit',
                    icon: 'fas fa-check',
                    label: app.translator.trans('barg-init.forum.sold_badge'),
                })
            );
        }
    });
}
