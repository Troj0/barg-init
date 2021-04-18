<?php

namespace Alterbyte\BargainInit;

use Flarum\Discussion\Discussion;
use Flarum\Post\Post;
use Flarum\User\User;

class Helpers
{
    public static function canSelectBargInit(User $user, Discussion $discussion)
    {
        // Prevent BargInit being set in a private discussion (ie byobu, etc)
        if ($discussion->is_private) {
            return false;
        }

        return $user->id == $discussion->user_id
            ? $user->can('selectBargInitOwnDiscussion', $discussion)
            : $user->can('selectBargInitNotOwnDiscussion', $discussion);
    }

    public static function canSelectPostAsBargInit(User $user, Post $post)
    {
        // Prevent BargInit being set in a private discussion (ie byobu, etc)
        if ($post->discussion->is_private) {
            return false;
        }

        $canSelectOwnPost = (bool) resolve('flarum.settings')->get('barg-init.allow_select_own_post');
        $can = self::canSelectBargInit($user, $post->discussion);

        return $user->id == $post->user_id
            ? $canSelectOwnPost && $can
            : $can;
    }

    public static function postBelongsToTargetDiscussion(Post $post, Discussion $discussion): bool
    {
        return $post->exists && $post->discussion_id === $discussion->id;
    }
}
