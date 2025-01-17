"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFfmpegInstalled = exports.doesFfmpegSupportCodec = exports.defaultFfmpegPath = void 0;
const execa_1 = __importDefault(require("execa"));
const ffmpeg_for_homebridge_1 = __importDefault(require("ffmpeg-for-homebridge"));
exports.defaultFfmpegPath = ffmpeg_for_homebridge_1.default || 'ffmpeg';
function doesFfmpegSupportCodec(codec, ffmpegPath = exports.defaultFfmpegPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const output = yield (0, execa_1.default)(ffmpegPath, ['-codecs']);
        return output.stdout.includes(codec);
    });
}
exports.doesFfmpegSupportCodec = doesFfmpegSupportCodec;
function isFfmpegInstalled(ffmpegPath = exports.defaultFfmpegPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, execa_1.default)(ffmpegPath, ['-codecs']);
            return true;
        }
        catch (_) {
            return false;
        }
    });
}
exports.isFfmpegInstalled = isFfmpegInstalled;
