<?php

/*
 * This file is part of alterbyte/barg-init.
 *
 * Copyright (c) 2020 alterbyte.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace Alterbyte\BargainInit;

use Flarum\Api\Serializer\BasicDiscussionSerializer;
use Flarum\Discussion\Discussion;
use Flarum\Discussion\Event\Saving;
use Flarum\Event\ConfigureNotificationTypes;
use Flarum\Extend;
use Flarum\Foundation\Application;
use Flarum\Post\Post;
use Flarum\User\User;
use Alterbyte\BargainInit\Console\NotifyCommand;
use Alterbyte\BargainInit\Events\BargInitSet;
use Alterbyte\BargainInit\Provider\ConsoleProvider;
use FoF\Components\Extend\AddFofComponents;
use FoF\Console\Extend\EnableConsole;
use Illuminate\Contracts\Events\Dispatcher;

return [
    new AddFofComponents(),
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/resources/less/forum.less'),
    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/resources/less/admin.less'),
    new Extend\Locales(__DIR__.'/resources/locale'),

    new EnableConsole(),

    new DefaultSettings(),

    (new Extend\Model(Discussion::class))
        ->belongsTo('bargInitPost', Post::class, 'barg_init_post_id')
        ->belongsTo('bargInitUser', User::class, 'barg_init_user_id'),

    (new Extend\Console())
        ->command(NotifyCommand::class),

    //(new Extend\View())
      //  ->namespace('BargainInit', __DIR__.'/resources/views'),

    function (Dispatcher $events) {
        $events->subscribe(Listeners\AddApiAttributes::class);

        $events->listen(ConfigureNotificationTypes::class, function (ConfigureNotificationTypes $event) {
            $event->add(Notification\SelectBargInitBlueprint::class, BasicDiscussionSerializer::class, ['alert', 'email']);
            $event->add(Notification\AwardedBargInitBlueprint::class, BasicDiscussionSerializer::class, ['alert']);
            $event->add(Notification\BargInitSetInDiscussionBlueprint::class, BasicDiscussionSerializer::class, []);
        });

        $events->listen(Saving::class, Listeners\SelectBargInit::class);
        $events->listen(BargInitSet::class, Listeners\QueueNotificationJobs::class);
    },

    function (Application $app) {
        $app->register(ConsoleProvider::class);
    },
];
