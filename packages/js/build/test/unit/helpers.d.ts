import { Client as BaseClient, Types } from '@honeybadger-io/core';
export declare function nullLogger(): Types.Logger;
export declare class TestTransport implements Types.Transport {
    defaultHeaders(): Record<string, string>;
    send<T>(_options: Types.TransportOptions, _payload: T): Promise<{
        statusCode: number;
        body: string;
    }>;
}
export declare class TestClient extends BaseClient {
    protected factory(_opts: Partial<Types.Config>): this;
    checkIn(_id: string): Promise<void>;
    protected showUserFeedbackForm(_options: Types.UserFeedbackFormOptions): Promise<void>;
    constructor(opts: Partial<Types.Config>, transport: Types.Transport);
    getPayload(noticeable: Types.Noticeable, name?: string | Partial<Types.Notice>, extra?: Partial<Types.Notice>): Types.NoticeTransportPayload;
}
//# sourceMappingURL=helpers.d.ts.map