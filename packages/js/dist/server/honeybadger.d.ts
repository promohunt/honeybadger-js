import { Client, Types } from '@honeybadger-io/core';
import { errorHandler, requestHandler } from './middleware';
import { lambdaHandler } from './aws_lambda';
import { CheckInsConfig } from './check-ins-manager/types';
declare type HoneybadgerServerConfig = (Types.Config | Types.ServerlessConfig) & CheckInsConfig;
declare class Honeybadger extends Client {
    private __checkInsClient;
    errorHandler: typeof errorHandler;
    requestHandler: typeof requestHandler;
    lambdaHandler: typeof lambdaHandler;
    config: HoneybadgerServerConfig;
    constructor(opts?: Partial<HoneybadgerServerConfig>);
    factory(opts?: Partial<HoneybadgerServerConfig>): this;
    configure(opts?: Partial<HoneybadgerServerConfig>): this;
    protected __initStore(): void;
    showUserFeedbackForm(): Promise<void>;
    checkIn(idOrSlug: string): Promise<void>;
    private checkInWithSlug;
    private checkInWithId;
    private isCheckInSlug;
    withRequest<R>(request: Record<symbol, unknown>, handler: (...args: never[]) => R, onError?: (...args: unknown[]) => unknown): R | void;
    run<R>(callback: (...args: never[]) => R): R;
}
declare const singleton: Honeybadger;
export { Types } from '@honeybadger-io/core';
export default singleton;
//# sourceMappingURL=server.d.ts.map