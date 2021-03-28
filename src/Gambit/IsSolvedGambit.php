<?php

namespace Alterbyte\BargainInit\Gambit;

use Flarum\Search\AbstractRegexGambit;
use Flarum\Search\SearchState;

class IsSolvedGambit extends AbstractRegexGambit
{
    protected function getGambitPattern()
    {
        return 'is:solved';
    }

    protected function conditions(SearchState $search, array $matches, $negate)
    {
        $search->getQuery()->where(function ($query) use ($negate) {
            if ($negate) {
                $query->whereNull('barg_init_post_id');
            } else {
                $query->whereNotNull('barg_init_post_id');
            }
        });
    }
}