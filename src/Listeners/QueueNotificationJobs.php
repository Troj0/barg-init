<?php

/*
 * This file is part of fof/best-answer.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Alterbyte\BargainInit\Listeners;

use Alterbyte\BargainInit\Events\BargInitSet;
use Alterbyte\BargainInit\Jobs;

class QueueNotificationJobs
{
    public function handle(BargInitSet $event)
    {
        app('flarum.queue.connection')->push(
            new Jobs\SendNotificationWhenBargInitSetInDiscussion($event->discussion, $event->actor)
        );
    }
}
