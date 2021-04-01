<?php

namespace Alterbyte\BargainInit\Console;

use Flarum\Foundation\Paths;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Console\Scheduling\Schedule;

class NotifySchedule
{
    public function __invoke(Schedule $schedule)
    {
        $settings = resolve(SettingsRepositoryInterface::class);

        $build = $schedule->command(NotifyCommand::class)
            ->hourly()
            ->withoutOverlapping();

        if ((bool) $settings->get('barg-init.schedule_on_one_server')) {
            $build->onOneServer();
        }

        if ((bool) $settings->get('barg-init.stop_overnight')) {
            $build->between('8:00', '21:00');
            //TODO expose times back to config options
        }

        if ((bool) $settings->get('barg-init.store_log_output')) {
            $paths = resolve(Paths::class);
            $build->appendOutputTo($paths->storage.(DIRECTORY_SEPARATOR.'logs'.DIRECTORY_SEPARATOR.'barg-init.log'));
        }

        return $schedule;
    }
    
}