import { Types, Client } from '@honeybadger-io/core';
export declare const getUserFeedbackScriptUrl: (version: string) => string;
declare class Honeybadger extends Client {
    config: Types.BrowserConfig;
    protected __afterNotifyHandlers: Types.AfterNotifyHandler[];
    constructor(opts?: Partial<Types.BrowserConfig>);
    configure(opts?: Partial<Types.BrowserConfig>): this;
    resetMaxErrors(): number;
    factory(opts?: Partial<Types.BrowserConfig>): this;
    checkIn(_id: string): Promise<void>;
    showUserFeedbackForm(options?: Types.UserFeedbackFormOptions): Promise<void>;
    private appendUserFeedbackScriptTag;
    private isUserFeedbackScriptUrlAlreadyVisible;
    private getUserFeedbackSubmitUrl;
}
declare const singleton: Honeybadger;
export { Types } from '@honeybadger-io/core';
export default singleton;
//# sourceMappingURL=browser.d.ts.map