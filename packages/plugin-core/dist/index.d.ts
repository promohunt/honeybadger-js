type HbPluginOptions = {
    apiKey: string;
    assetsUrl: string;
    endpoint: string;
    retries: number;
    revision: string;
    silent: boolean;
    deployEndpoint: string;
    deploy: boolean | Deploy;
    ignorePaths: Array<string>;
    ignoreErrors: boolean;
    workerCount: number;
};
type HbPluginUserOptions = Partial<HbPluginOptions> & Pick<HbPluginOptions, 'apiKey' | 'assetsUrl'>;
type Deploy = {
    repository?: string;
    localUsername?: string;
    environment?: string;
};
type DeployBody = {
    deploy: {
        revision: string;
        repository?: string;
        local_username?: string;
        environment?: string;
    };
};
type SourcemapInfo = {
    sourcemapFilename: string;
    sourcemapFilePath: string;
    jsFilename: string;
    jsFilePath: string;
};

type types_d_Deploy = Deploy;
type types_d_DeployBody = DeployBody;
type types_d_HbPluginOptions = HbPluginOptions;
type types_d_HbPluginUserOptions = HbPluginUserOptions;
type types_d_SourcemapInfo = SourcemapInfo;
declare namespace types_d {
  export type { types_d_Deploy as Deploy, types_d_DeployBody as DeployBody, types_d_HbPluginOptions as HbPluginOptions, types_d_HbPluginUserOptions as HbPluginUserOptions, types_d_SourcemapInfo as SourcemapInfo };
}

/**
 * Executes an API call to send a deploy notification
 */
declare function sendDeployNotification(hbOptions: HbPluginOptions): Promise<Response>;

/**
 * Uploads sourcemaps to API endpoint
 */
declare function uploadSourcemaps(sourcemapData: SourcemapInfo[], hbOptions: HbPluginOptions): Promise<Response[]>;

declare function cleanOptions(options: Partial<HbPluginOptions> & Pick<HbPluginOptions, 'apiKey' | 'assetsUrl'>): HbPluginOptions;

export { types_d as Types, cleanOptions, sendDeployNotification, uploadSourcemaps };
