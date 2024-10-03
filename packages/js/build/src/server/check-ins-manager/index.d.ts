import { Types } from '@honeybadger-io/core';
import { CheckInsClient } from './client';
import { CheckInsConfig } from './types';
import { CheckIn } from './check-in';
export declare class CheckInsManager {
    private readonly client;
    config: Required<CheckInsConfig>;
    logger: Types.Logger;
    constructor(config: Partial<CheckInsConfig>, client?: CheckInsClient);
    sync(): Promise<CheckIn[]>;
    private getLocalCheckIns;
    private createOrUpdate;
    private remove;
}
//# sourceMappingURL=index.d.ts.map