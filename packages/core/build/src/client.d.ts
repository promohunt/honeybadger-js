import { Config, Logger, BeforeNotifyHandler, AfterNotifyHandler, Notice, Noticeable, HoneybadgerStore, Transport, NoticeTransportPayload, UserFeedbackFormOptions, Notifier, EventsLogger } from './types';
export declare abstract class Client {
    protected __pluginsLoaded: boolean;
    protected __store: HoneybadgerStore;
    protected __beforeNotifyHandlers: BeforeNotifyHandler[];
    protected __afterNotifyHandlers: AfterNotifyHandler[];
    protected __getSourceFileHandler: (path: string) => Promise<string>;
    protected readonly __transport: Transport;
    protected readonly __eventsLogger: EventsLogger;
    protected __notifier: Notifier;
    config: Config;
    logger: Logger;
    protected constructor(opts: Partial<Config>, transport: Transport);
    protected abstract factory(opts: Partial<Config>): this;
    protected abstract checkIn(id: string): Promise<void>;
    protected abstract showUserFeedbackForm(options: UserFeedbackFormOptions): Promise<void>;
    getVersion(): string;
    getNotifier(): Notifier;
    /**
     * CAREFUL: When adding a new notifier or updating the name of an existing notifier,
     * the Honeybadger rails project may need its mappings updated.
     * See https://github.com/honeybadger-io/honeybadger/blob/master/app/presenters/breadcrumbs_presenter.rb
     *     https://github.com/honeybadger-io/honeybadger/blob/master/app/models/parser/java_script.rb
     *     https://github.com/honeybadger-io/honeybadger/blob/master/app/models/language.rb
     **/
    setNotifier(notifier: Notifier): void;
    configure(opts?: Partial<Config>): this;
    loadPlugins(): void;
    protected __initStore(): void;
    beforeNotify(handler: BeforeNotifyHandler): Client;
    afterNotify(handler: AfterNotifyHandler): Client;
    setContext(context: Record<string, unknown>): Client;
    resetContext(context?: Record<string, unknown>): Client;
    clear(): Client;
    notify(noticeable: Noticeable, name?: string | Partial<Notice>, extra?: Partial<Notice>): boolean;
    /**
     * An async version of {@link notify} that resolves only after the notice has been reported to Honeybadger.
     * Implemented using the {@link afterNotify} hook.
     * Rejects if for any reason the report failed to be reported.
     * Useful in serverless environments (AWS Lambda).
     */
    notifyAsync(noticeable: Noticeable, name?: string | Partial<Notice>, extra?: Partial<Notice>): Promise<void>;
    protected makeNotice(noticeable: Noticeable, name?: string | Partial<Notice>, extra?: Partial<Notice>): Notice | null;
    addBreadcrumb(message: string, opts?: Record<string, unknown>): Client;
    logEvent(data: Record<string, unknown>): void;
    __getBreadcrumbs(): import("./types").BreadcrumbRecord[];
    __getContext(): Record<string, unknown>;
    protected __developmentMode(): boolean;
    protected __buildPayload(notice: Notice): NoticeTransportPayload;
    protected __constructTags(tags: unknown): Array<string>;
    private __runPreconditions;
    private __send;
}
//# sourceMappingURL=client.d.ts.map