import { Transport, Config, EventsLogger } from './types';
export declare class ThrottledEventsLogger implements EventsLogger {
    private config;
    private transport;
    private queue;
    private isProcessing;
    private logger;
    constructor(config: Partial<Config>, transport: Transport);
    configure(opts: Partial<Config>): void;
    logEvent(data: Record<string, unknown>): void;
    private processQueue;
    private makeHttpRequest;
    /**
     * todo: improve this
     *
     * The EventsLogger overrides the console methods
     * so if we want to log something we need to use the original methods
     */
    private originalLogger;
}
//# sourceMappingURL=throttled_events_logger.d.ts.map