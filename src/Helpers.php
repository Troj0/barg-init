<?php

namespace Alterbyte\BargainInit;

use Flarum\Discussion\Discussion;
use Flarum\Post\Post;
use Flarum\User\User;

class Helpers
{
    public static function canSelectBargInit(User $user, Discussion $discussion)
    {
        return $user->id == $discussion->user_id
            ? $user->can('selectBargInitOwnDiscussion', $discussion)
            : $user->can('selectBargInitNotOwnDiscussion', $discussion);
    }

    public static function canSelectPostAsBargInit(User $user, Post $post)
    {
        $canSelectOwnPost = (bool) app('flarum.settings')->get('barg-init.allow_select_own_post');
        $can = self::canSelectBargInit($user, $post->discussion);

        return $user->id == $post->user_id
            ? $canSelectOwnPost && $can
            : $can;
    }

    public static function postBelongsToTargetDiscussion(Post $post, Discussion $discussion): bool
    {
        return $post && $post->discussion_id === $discussion->id;
    }
}
