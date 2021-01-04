<?php

namespace Alterbyte\BargainInit\Listeners;

use Carbon\Carbon;
use DateTime;
use Flarum\Api\Controller\ShowDiscussionController;
use Flarum\Api\Event\Serializing;
use Flarum\Api\Event\WillGetData;
use Flarum\Api\Serializer\BasicPostSerializer;
use Flarum\Api\Serializer\BasicUserSerializer;
use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Event\GetApiRelationship;
use Flarum\Settings\SettingsRepositoryInterface;
use Alterbyte\BargainInit\Helpers;
use Illuminate\Contracts\Events\Dispatcher;

class AddApiAttributes
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function subscribe(Dispatcher $events)
    {
        $events->listen(GetApiRelationship::class, [$this, 'getApiBargAttributes']);
        $events->listen(Serializing::class, [$this, 'prepareApiBargAttributes']);
        $events->listen(WillGetData::class, [$this, 'includeBargPost']);
    }

    public function getApiBargAttributes(GetApiRelationship $event)
    {
        if ($event->isRelationship(DiscussionSerializer::class, 'bargInitPost')) {
            return $event->serializer->hasOne($event->model, BasicPostSerializer::class, 'bargInitPost');
        }
        if ($event->isRelationship(DiscussionSerializer::class, 'bargInitUser')) {
            return $event->serializer->hasOne($event->model, BasicUserSerializer::class, 'bargInitUser');
        }
    }

    public function prepareApiBargAttributes(Serializing $event)
    {
        if ($event->isSerializer(DiscussionSerializer::class)) {
            $event->attributes['canSelectBargInit'] = Helpers::canSelectBargInit($event->actor, $event->model);
            $event->attributes['hasBargInit'] = $event->model->bargInitPost()->exists();
            $event->attributes['startUserId'] = $event->model->user_id;
            $event->attributes['firstPostId'] = $event->model->first_post_id;
            if ($event->model->barg_init_set_at) {
                $event->attributes['bargInitSetAt'] = Carbon::createFromTimeString($event->model->barg_init_set_at)->format(DateTime::RFC3339);
            }
        }

        if ($event->isSerializer(ForumSerializer::class)) {
            $event->attributes['canSelectBargInitOwnPost'] = (bool) app('flarum.settings')->get('barg-init.allow_select_own_post');
            $event->attributes['useAlternativeBargInitUi'] = (bool) app('flarum.settings')->get('barg-init.use_alternative_ui', false);
        }
    }

    public function includeBargPost(WillGetData $event)
    {
        if ($event->isController(ShowDiscussionController::class)) {
            $event->addInclude('bargInitPost');
            $event->addInclude('bargInitPost.discussion');
            $event->addInclude('bargInitPost.user');
            $event->addInclude('bargInitUser');
        }
    }
}
