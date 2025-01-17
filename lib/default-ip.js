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
exports.getDefaultIpAddress = void 0;
const os_1 = __importDefault(require("os"));
const systeminformation_1 = require("systeminformation");
// NOTE: This is used to get the default ip address seen from outside the device.
// This _was_ needed to set the `address` field for hap camera streams, but the address is automatically determined after homebridge 1.1.3
// Keeping this here for backwards compatibility for now.  All camera plugins will eventually drop support for <1.1.3 and this can be removed
function getDefaultIpAddress(preferIpv6 = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const interfaces = os_1.default.networkInterfaces(), defaultInterfaceName = yield (0, systeminformation_1.networkInterfaceDefault)(), defaultInterface = interfaces[defaultInterfaceName], externalInfo = defaultInterface === null || defaultInterface === void 0 ? void 0 : defaultInterface.filter((info) => !info.internal), preferredFamily = preferIpv6 ? 'IPv6' : 'IPv4', addressInfo = (externalInfo === null || externalInfo === void 0 ? void 0 : externalInfo.find((info) => info.family === preferredFamily)) ||
            (externalInfo === null || externalInfo === void 0 ? void 0 : externalInfo[0]);
        if (!addressInfo) {
            throw new Error('Unable to get default network address');
        }
        return addressInfo.address;
    });
}
exports.getDefaultIpAddress = getDefaultIpAddress;
