import { Types } from '@honeybadger-io/core';
import { CheckIn } from './check-in';
import { CheckInsConfig } from './types';
export declare class CheckInsClient {
    private readonly BASE_URL;
    private readonly config;
    private readonly logger;
    private readonly transport;
    constructor(config: Pick<CheckInsConfig, 'apiKey' | 'personalAuthToken' | 'logger'>, transport: Types.Transport);
    getProjectId(projectApiKey: string): Promise<string>;
    listForProject(projectId: string): Promise<CheckIn[]>;
    get(projectId: string, checkInId: string): Promise<CheckIn>;
    create(projectId: string, checkIn: CheckIn): Promise<CheckIn>;
    update(projectId: string, checkIn: CheckIn): Promise<CheckIn>;
    remove(projectId: string, checkIn: CheckIn): Promise<void>;
    private getHeaders;
    private getErrorMessage;
}
//# sourceMappingURL=client.d.ts.map