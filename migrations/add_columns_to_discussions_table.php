<?php

/*
 * This file is part of fof/best-answer.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use Flarum\Discussion\Discussion;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if (!$schema->hasColumn('discussions', 'barg_init_user_id')) {
            $schema->table('discussions', function (Blueprint $table) {
                $table->unsignedInteger('barg_init_post_id')->nullable();
                $table->unsignedInteger('barg_init_user_id')->nullable();
            });
        }

        if (!$schema->hasColumn('discussions', 'barg_init_notified')) {
            $schema->table('discussions', function (Blueprint $table) {
                $table->boolean('barg_init_notified');
            });

            Discussion::query()->where('barg_init_notified', false)->update(['barg_init_notified' => 1]);
        }
    },
    'down' => function (Builder $schema) {
        $schema->table('discussions', function (Blueprint $table) {
            $table->dropColumn('barg_init_post_id');
            $table->dropColumn('barg_init_user_id');
            $table->dropColumn('barg_init_notified');
        });
    },
];
