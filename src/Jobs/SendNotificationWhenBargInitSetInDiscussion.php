<?php

/*
 * This file is part of fof/best-answer.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Alterbyte\BargainInit\Jobs;

use Flarum\Discussion\Discussion;
use Flarum\Notification\NotificationSyncer;
use Flarum\Post\Post;
use Flarum\User\User;
use Alterbyte\BargainInit\Notification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\SerializesModels;

class SendNotificationWhenBargInitSetInDiscussion implements ShouldQueue
{
    use Queueable;
    use SerializesModels;

    /**
     * @var Discussion
     */
    protected $discussion;

    /**
     * @var User
     */
    protected $actor;

    protected $settings;

    public function __construct(
        Discussion $discussion,
        User $actor
    ) {
        $this->discussion = $discussion;
        $this->actor = $actor;
    }

    public function handle(NotificationSyncer $notifications)
    {
        if ($this->discussion === null || $this->discussion->barg_init_post_id === null) {
            return;
        }

        $bargInitAuthor = $this->getUserFromPost($this->discussion->barg_init_post_id);

        // Send notification to the post author that has been awarded the best answer, except if the best answer was set by the author
        if ($bargInitAuthor->id !== $this->actor->id) {
            $notifications->sync(new Notification\AwardedBargInitBlueprint($this->discussion, $this->actor), [$bargInitAuthor]);
        }

        // Send notifications to other participants of the discussion
        $recipients = User::whereIn('id', Post::select('user_id')->where('discussion_id', $this->discussion->id))
            ->whereNotIn('id', [$bargInitAuthor->id, $this->actor->id])
            ->get();

        $notifications->sync(new Notification\BargInitSetInDiscussionBlueprint($this->discussion, $this->actor), $recipients->all());
    }

    public function getUserFromPost(int $post_id): User
    {
        return Post::find($post_id)->user;
    }
}
