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

use Carbon\Carbon;
use DateTime;
use Flarum\Api\Controller\ListDiscussionsController;
use Flarum\Api\Controller\ShowDiscussionController;
use Flarum\Api\Serializer\BasicPostSerializer;
use Flarum\Api\Serializer\BasicUserSerializer;
use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Database\AbstractModel;
use Flarum\Discussion\Search\DiscussionSearcher;
use Flarum\Api\Serializer\BasicDiscussionSerializer;
use Flarum\Discussion\Discussion;
use Flarum\Discussion\Event\Saving;
use Flarum\Event\ConfigureNotificationTypes;
use Flarum\Extend;
use Flarum\Foundation\Application;
use Flarum\Post\Post;
use Flarum\User\User;
use Alterbyte\BargainInit\Console\NotifyCommand;
use Alterbyte\BargainInit\Console\NotifySchedule;
use Alterbyte\BargainInit\Events\BargInitSet;
use Alterbyte\BargainInit\Provider\ConsoleProvider;
use FoF\Components\Extend\AddFofComponents;
use FoF\Console\Extend\EnableConsole;
use FoF\Console\Extend\ScheduleCommand;
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

    (new Extend\View())
        ->namespace('BargainInit', __DIR__.'/resources/views'),

        (new Extend\Event())
        ->listen(Saving::class, Listeners\SelectBargInit::class)
        ->listen(BargInitSet::class, Listeners\QueueNotificationJobs::class),

        (new Extend\Notification())
        ->type(Notification\SelectBargInitBlueprint::class, BasicDiscussionSerializer::class, ['alert', 'email'])
        ->type(Notification\AwardedBargInitBlueprint::class, BasicDiscussionSerializer::class, ['alert'])
        ->type(Notification\BargInitSetInDiscussionBlueprint::class, BasicDiscussionSerializer::class, []),

        (new Extend\ApiSerializer(DiscussionSerializer::class))
        ->hasOne('bargInitPost', BasicPostSerializer::class)
        ->hasOne('bargInitUser', BasicUserSerializer::class)
        ->attribute('bargInitAnswer', function (DiscussionSerializer $serializer, AbstractModel $discussion) {
            return (bool) $discussion->bargInitPost;
        })
        ->attribute('canSelectbargInit', function (DiscussionSerializer $serializer, AbstractModel $discussion) {
            return Helpers::canSelectbargInit($serializer->getActor(), $discussion);
        })
        ->attribute('bargInitSetAt', function (DiscussionSerializer $serializer, AbstractModel $discussion) {
            if ($discussion->best_answer_set_at) {
                return Carbon::createFromTimeString($discussion->barg_init_set_at)->format(DateTime::RFC3339);
            }

            return null;
        }),

        (new Extend\Settings())
        ->serializeToForum('canSelectBargInitOwnPost', 'barg-init.allow_select_own_post', 'boolVal')
        ->serializeToForum('useAlternativeBargInitUi', 'barg-init.use_alternative_ui', 'boolVal'),

        (new Extend\ApiController(ShowDiscussionController::class))
        ->addInclude(['bargInitPost', 'bargInitUser']),

        (new Extend\ApiController(ListDiscussionsController::class))
        ->addInclude(['bargInitPost']),

        new ScheduleCommand(new NotifySchedule()),

       (new Extend\SimpleFlarumSearch(DiscussionSearcher::class))
        ->addGambit(Gambit\IsSolvedGambit::class),
];