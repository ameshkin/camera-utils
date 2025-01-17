export interface FfmpegProcessOptions {
    ffmpegPath?: string;
    ffmpegArgs: (string | number)[];
    logger?: {
        error: (log: string) => unknown;
        info: (log: string) => unknown;
    };
    logLabel?: string;
    exitCallback?: (code: number | null, signal: string | null) => unknown;
    stdoutCallback?: (data: any) => unknown;
    startedCallback?: () => unknown;
}
export declare class FfmpegProcess {
    readonly options: FfmpegProcessOptions;
    private ff;
    private processSubscription;
    private started;
    private stopped;
    private exited;
    constructor(options: FfmpegProcessOptions);
    stop(): void;
    writeStdin(input: string): void;
}
