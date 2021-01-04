<?php

/*
 * This file is part of fof/best-answer.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use Flarum\Group\Group;
use Flarum\Group\Permission;
use Illuminate\Database\Schema\Builder;

$permissionKey = 'discussion.selectBargInitOwnDiscussion';

return [
    'up' => function (Builder $schema) use ($permissionKey) {
        /**
         * @var \Flarum\Settings\SettingsRepositoryInterface
         */
        $settings = app('flarum.settings');

        foreach (['allow_select_own_post', 'select_barg_init_reminder_days'] as $setting) {
            if ($value = $settings->get($key = "flarum-barg-init.$setting")) {
                $settings->set("alterbyte-barg-init.$setting", $value);
                $settings->delete($key);
            }
        }

        $db = $schema->getConnection();
        $permission = $db->table('group_permission')
            ->where('permission', 'discussion.selectBargInit');

        if (!Permission::query()->where('permission', $permissionKey)->exists()) {
            if ($permission->exists()) {
                $permission->update([
                    'permission' => $permissionKey,
                ]);
            } else {
                $db->table('group_permission')->insert([
                    'group_id'   => Group::MEMBER_ID,
                    'permission' => $permissionKey,
                ]);
            }
        }
    },
    'down' => function (Builder $schema) use ($permissionKey) {
        $db = $schema->getConnection();

        $db->table('group_permission')->where('permission', $permissionKey)->delete();
    },
];
