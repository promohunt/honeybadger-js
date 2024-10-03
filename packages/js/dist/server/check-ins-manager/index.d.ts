import { Types } from '@honeybadger-io/core';
import { CheckInsClient } from './types/client';
import { CheckInsConfig } from './types/types';
import { CheckIn } from './types/check-in';
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