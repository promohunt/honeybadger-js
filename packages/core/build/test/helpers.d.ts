import { Client as BaseClient } from '../src/client';
import { Config, Logger, Notice, Noticeable, Transport, TransportOptions, UserFeedbackFormOptions } from '../src/types';
export declare function nullLogger(): Logger;
export declare class TestTransport implements Transport {
    defaultHeaders(): Record<string, string>;
    send<T>(_options: TransportOptions, _payload: T): Promise<{
        statusCode: number;
        body: string;
    }>;
}
export declare class TestClient extends BaseClient {
    protected factory(_opts: Partial<Config>): this;
    checkIn(_id: string): Promise<void>;
    protected showUserFeedbackForm(_options: UserFeedbackFormOptions): Promise<void>;
    constructor(opts: Partial<Config>, transport: Transport);
    getPayload(noticeable: Noticeable, name?: string | Partial<Notice>, extra?: Partial<Notice>): import("../src/types").NoticeTransportPayload;
    getPluginsLoaded(): boolean;
}
//# sourceMappingURL=helpers.d.ts.map