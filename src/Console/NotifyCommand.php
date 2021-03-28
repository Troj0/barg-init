<?php

namespace FoF\BestAnswer\Console;

use Carbon\Carbon;
use Flarum\Discussion\Discussion;
use Flarum\Extension\ExtensionManager;
use Flarum\Notification\NotificationSyncer;
use Flarum\Settings\SettingsRepositoryInterface;
use Alterbyte\BargainInit\Notification\SelectBargInitBlueprint;
use Illuminate\Console\Command;
use Symfony\Contracts\Translation\TranslatorInterface;
use Throwable;

class NotifyCommand extends Command
{
    /**
     * @var SettingsRepositoryInterface
     */
    private $settings;

    /**
     * @var NotificationSyncer
     */
    private $notifications;

    /**
     * @var TranslatorInterface
     */
    private $translator;

    /**
     * @var ExtensionManager
     */
    private $extensions;

    public function __construct(SettingsRepositoryInterface $settings, NotificationSyncer $notifications, TranslatorInterface $translator, ExtensionManager $extensions)
    {
        parent::__construct();

        $this->settings = $settings;
        $this->notifications = $notifications;
        $this->translator = $translator;
        $this->extensions = $extensions;
    }

    /**
     * @var string
     */
    protected $signature = 'alterbyte:barg-init:notify';

    /**
     * @var string
     */
    protected $description = 'After a configurable number of days, notifies OP of discussions with no post selected as barg init to select one.';

    public function handle()
    {
        $days = (int) $this->settings->get('barg-init.select_barg_init_reminder_days');
        $time = Carbon::now()->subDays($days);

        if ($days <= 0) {
            $this->info('Reminders are disabled');

            return;
        }

        $this->info('Looking at discussions before '.$time->toDateTimeString());

        $query = Discussion::query();

        if ($this->extensions->isEnabled('flarum-tags')) {
            $tags = explode(',', $this->settings->get('barg-init.remind_tag_ids'));
            if ($tags) {
                $query->leftJoin('discussion_tag', 'discussion_tag.discussion_id', '=', 'discussions.id');
                $query->whereIn('discussion_tag.tag_id', $tags);
            }
        }
//add_columns_to_discussion_table.php
        $query->whereNull('discussions.barg_init_post_id')
            ->whereNull('discussions.hidden_at')
            ->where('discussions.barg_init_notified', false)
            ->where('discussions.comment_count', '>', 1)
            ->where('discussions.is_private', 0)
            ->whereDate('discussions.created_at', '<', $time);

        $count = $query->count();

        if ($count == 0) {
            $this->info('Nothing to do');

            return;
        }

        $errors = [];

        $query->chunk(20, function ($discussions) use (&$errors) {
            /*
             * @var $discussions Discussion[]
             */
            $this->output->write('<info>Sending '.count($discussions).' notifications </info>');

            foreach ($discussions as $d) {
                try {
                    $this->notifications->sync(
                        new SelectBargInitBlueprint($d, $this->translator),
                        [$d->user]
                    );

                    $this->output->write('<info>#</info>');

                    $d->barg_init_notified = true;
                    $d->save();
                } catch (Throwable $e) {
                    $this->output->write('<error>#</error>');
                    $errors[] = $e;
                }
            }

            $this->line('');
        });

        if (count($errors) > 0) {
            $this->line("\n");
            $this->alert('Failed to send '.count($errors).' notifications');
            $this->warn('');

            foreach ($errors as $i => $e) {
                $n = $i + 1;

                $this->output->writeln("<warning>$n >>>>>></warning> <error>$e</error>");
                $this->line('');
            }
        }
    }
}
