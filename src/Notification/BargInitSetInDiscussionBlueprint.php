<?php

/*
 * This file is part of fof/best-answer.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Alterbyte\BargainInit\Notification;

use Flarum\Discussion\Discussion;
use Flarum\Notification\Blueprint\BlueprintInterface;
use Flarum\Notification\MailableInterface;
use Flarum\User\User;
use Symfony\Component\Translation\TranslatorInterface; //change

class BargInitSetInDiscussionBlueprint implements BlueprintInterface, MailableInterface
{
    /**
     * @var Discussion
     */
    public $discussion;

    /**
     * @var User
     */
    public $actor;

    public function __construct(Discussion $discussion, User $actor)
    {
        $this->discussion = $discussion;
        $this->actor = $actor;
    }

    /**
     * Get the user that sent the notification.
     */
    public function getFromUser()
    {
        return $this->actor;
    }

    /**
     * Get the model that is the subject of this activity.
     */
    public function getSubject()
    {
        return $this->discussion;
    }

    /**
     * Get the data to be stored in the notification.
     */
    public function getData()
    {
    }

    /**
     * Get the serialized type of this activity.
     *
     * @return string
     */
    public static function getType()
    {
        return 'BargInitInDiscussion'; //forum/index.js
    }

    /**
     * Get the name of the model class for the subject of this activity.
     *
     * @return string
     */
    public static function getSubjectModel()
    {
        return Discussion::class;
    }

    /**
     * Get the name of the view to construct a notification email with.
     *
     * @return string
     */
    public function getEmailView()
    {
        return ['text' => 'alterbyte-barg-init::emails.bargInitSetInDiscussion.blade'];
    }

    /**
     * Get the subject line for the notification email.
     *
     * @return string
     */
    public function getEmailSubject(TranslatorInterface $translator) //change
    {
        return $translator->trans('fof-best-answer.forum.notification.barg_init_set_in_discussion_email', [ //change
            'user'  => $this->actor->username,
            'title' => $this->discussion->title,
        ]);
    }
}
