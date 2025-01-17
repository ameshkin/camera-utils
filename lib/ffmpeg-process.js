"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FfmpegProcess = void 0;
const rxjs_1 = require("rxjs");
const child_process_1 = require("child_process");
const ffmpeg_1 = require("./ffmpeg");
const noop = () => null, onGlobalProcessStopped = new rxjs_1.Subject();
// register a single event listener, rather than listener per ffmpeg process
// this helps avoid a warning for hitting too many listeners
process.on('exit', () => onGlobalProcessStopped.next(null));
class FfmpegProcess {
    constructor(options) {
        this.options = options;
        this.ff = (0, child_process_1.spawn)(this.options.ffmpegPath || ffmpeg_1.defaultFfmpegPath, this.options.ffmpegArgs.map((x) => x.toString()));
        this.processSubscription = onGlobalProcessStopped.subscribe(() => {
            this.stop();
        });
        this.started = false;
        this.stopped = false;
        this.exited = false;
        const { logger, logLabel } = options, logError = (logger === null || logger === void 0 ? void 0 : logger.error) || noop, logInfo = (logger === null || logger === void 0 ? void 0 : logger.info) || noop, logPrefix = logLabel ? `${logLabel}: ` : '';
        if (options.stdoutCallback) {
            const { stdoutCallback } = options;
            this.ff.stdout.on('data', (data) => {
                stdoutCallback(data);
            });
        }
        this.ff.stderr.on('data', (data) => {
            var _a;
            if (!this.started) {
                this.started = true;
                (_a = options.startedCallback) === null || _a === void 0 ? void 0 : _a.call(options);
            }
            logInfo(logPrefix + data);
        });
        this.ff.stdin.on('error', (error) => {
            if (!error.message.includes('EPIPE')) {
                logError(logPrefix + error.message);
            }
        });
        this.ff.on('exit', (code, signal) => {
            var _a, _b;
            this.exited = true;
            (_b = (_a = this.options).exitCallback) === null || _b === void 0 ? void 0 : _b.call(_a, code, signal);
            if (!code || code === 255) {
                logInfo(logPrefix + 'stopped gracefully');
            }
            else {
                logError(logPrefix + `exited with code ${code} and signal ${signal}`);
            }
            this.stop();
        });
    }
    stop() {
        if (this.stopped) {
            return;
        }
        this.stopped = true;
        this.processSubscription.unsubscribe();
        this.ff.stderr.pause();
        this.ff.stdout.pause();
        if (!this.exited) {
            this.ff.kill();
        }
    }
    writeStdin(input) {
        if (this.stopped) {
            return;
        }
        this.ff.stdin.write(input);
        this.ff.stdin.end();
    }
}
exports.FfmpegProcess = FfmpegProcess;
