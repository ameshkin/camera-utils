"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSrtpOptions = exports.createCryptoLine = exports.decodeSrtpOptions = exports.encodeSrtpOptions = void 0;
const crypto_1 = require("crypto");
function encodeSrtpOptions({ srtpKey, srtpSalt }) {
    return Buffer.concat([srtpKey, srtpSalt]).toString('base64');
}
exports.encodeSrtpOptions = encodeSrtpOptions;
function decodeSrtpOptions(encodedOptions) {
    const crypto = Buffer.from(encodedOptions, 'base64');
    return {
        srtpKey: crypto.slice(0, 16),
        srtpSalt: crypto.slice(16, 30),
    };
}
exports.decodeSrtpOptions = decodeSrtpOptions;
function createCryptoLine(srtpOptions) {
    const encodedOptions = encodeSrtpOptions(srtpOptions);
    return `a=crypto:1 AES_CM_128_HMAC_SHA1_80 inline:${encodedOptions}`;
}
exports.createCryptoLine = createCryptoLine;
function generateSrtpOptions() {
    return {
        srtpKey: (0, crypto_1.randomBytes)(16),
        srtpSalt: (0, crypto_1.randomBytes)(14),
    };
}
exports.generateSrtpOptions = generateSrtpOptions;
