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
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindToPort = exports.reservePorts = void 0;
const pick_port_1 = require("pick-port");
// Need to reserve ports in sequence because ffmpeg uses the next port up by default.  If it's taken, ffmpeg will error
function reservePorts({ count = 1, type = 'udp', attemptNumber = 0, } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (attemptNumber > 100) {
            throw new Error('Failed to reserve ports after 100 tries');
        }
        const pickPortOptions = {
            type,
            reserveTimeout: 15, // 15 seconds is max setup time for HomeKit streams, so the port should be in use by then
        }, port = yield (0, pick_port_1.pickPort)(pickPortOptions), ports = [port], tryAgain = () => {
            return reservePorts({
                count,
                type,
                attemptNumber: attemptNumber + 1,
            });
        };
        for (let i = 1; i < count; i++) {
            try {
                const targetConsecutivePort = port + i, openPort = yield (0, pick_port_1.pickPort)(Object.assign(Object.assign({}, pickPortOptions), { minPort: targetConsecutivePort, maxPort: targetConsecutivePort }));
                ports.push(openPort);
            }
            catch (_) {
                // can't reserve next port, bail and get another set
                return tryAgain();
            }
        }
        return ports;
    });
}
exports.reservePorts = reservePorts;
function bindToPort(socket) {
    return new Promise((resolve, reject) => {
        socket.on('error', reject);
        // 0 means select a random open port
        socket.bind(0, () => {
            const { port } = socket.address();
            resolve(port);
        });
    });
}
exports.bindToPort = bindToPort;
