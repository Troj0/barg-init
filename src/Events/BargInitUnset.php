<?php

namespace Alterbyte\BargainInit\Events;

use Flarum\Discussion\Discussion;
use Flarum\User\User;

class BargInitUnset
{
    /**
     * @var Discussion
     */
    public $discussion;

    /**
     * @var User
     */
    public $actor;

    /**
     * BestAnswerUnset constructor.
     *
     * @param Discussion $discussion
     * @param User       $actor
     */
    public function __construct(Discussion $discussion, User $actor)
    {
        $this->discussion = $discussion;
        $this->actor = $actor;
    }
}