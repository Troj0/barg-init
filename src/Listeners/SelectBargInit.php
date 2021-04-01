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

use Carbon\Carbon;
use Flarum\Discussion\Event\Saving;
use Flarum\Foundation\ValidationException;
use Flarum\Notification\Notification;
use Flarum\Notification\NotificationSyncer;
use Flarum\User\Exception\PermissionDeniedException;
use Alterbyte\BargainInit\Events\BargInitSet;
use Alterbyte\BargainInit\Events\BargInitUnset;
use Alterbyte\BargainInit\Helpers;
use Alterbyte\BargainInit\Notification\SelectBargInitBlueprint;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Arr;
use Symfony\Contracts\Translation\TranslatorInterface;

class SelectBargInit
{
    private $key = 'attributes.bargInitPostId';

    /**
     * @var NotificationSyncer
     */
    private $notifications;

    /**
     * @var Dispatcher
     */
    private $bus;

    /**
     * @var TranslatorInterface
     */
    private $translator;

    public function __construct(NotificationSyncer $notifications, Dispatcher $bus, TranslatorInterface $translator)
    {
        $this->notifications = $notifications;
        $this->bus = $bus;
        $this->translator = $translator;
    }

    public function handle(Saving $event)
    {
        if (!Arr::has($event->data, $this->key)) {
            return;
        }

        $actor = $event->actor;

        $discussion = $event->discussion;
        $id = (int) Arr::get($event->data, $this->key);

        if (!isset($id) || !$discussion->exists || $discussion->barg_init_post_id == $id) {
            return;
        }

        $post = $event->discussion->posts()->find($id);

        // If 'id' = 0, then we are removing a barg init.
        if ($id > 0 && !Helpers::postBelongsToTargetDiscussion($post, $discussion)) {
            throw new ValidationException(
                [
                    'error' => $this->translator->trans('barg-init.forum.errors.mismatch'),
                ]
            );
        }

        if ($post && (!Helpers::canSelectPostAsBargInit($event->actor, $post) || !$post->isVisibleTo($actor))) {
            throw new PermissionDeniedException();
        }

        if ($id > 0) {
            $discussion->barg_init_post_id = $id;
            $discussion->barg_init_user_id = $actor->id;
            $discussion->barg_init_set_at = Carbon::now();
            
        $attributes = Arr::get($event->data, 'attributes', []);
        if (array_key_exists('alterbyteBidding', $attributes))  {
            $validator = app(RatingValidator::class);
            $validator->assertValid([
                'bid' => $attributes['alterbyteBidding'],
            ]);
        }

        //add_columns_to_discussion_table.php
        if ($id > 0) {
            $discussion->barg_init_post_id = $id;
            //$discussion->alterbyte_Dis_rating = $attributes['alterbyteBidding'];
            $discussion->barg_init_user_id = $event->actor->id;
            $discussion->barg_init_set_at = Carbon::now();

            Notification::where('type', 'selectBargInit')->where('subject_id', $discussion->id)->delete();
            $this->notifyUsersOfBargInitSet($event);
        } elseif ($id == 0) {
            $discussion->barg_init_post_id = null;
            $discussion->barg_init_user_id = null;
            $discussion->barg_init_set_at = null;

            $event->discussion->afterSave(function ($discussion) use ($actor) {
                $this->bus->dispatch(new BargInitUnset($discussion, $actor));
            });
        }

        $this->notifications->delete(new SelectBargInitBlueprint($discussion));
    }

    public function notifyUsersOfBargInitSet(Saving $event)
    {
        $actor = $event->actor;

        $event->discussion->afterSave(function ($discussion) use ($actor) {
            $this->bus->dispatch(new BargInitSet($discussion, $actor));
        });
    }
}
