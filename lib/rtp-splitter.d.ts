/// <reference types="node" />
/// <reference types="node" />
import { RemoteInfo } from 'dgram';
export interface SocketTarget {
    port: number;
    address?: string;
}
export interface RtpMessageDescription {
    isRtpMessage: boolean;
    payloadType: number;
    info: RemoteInfo;
    message: Buffer;
}
export type RtpMessageHandler = (description: RtpMessageDescription) => SocketTarget | null;
export declare class RtpSplitter {
    readonly socket: import("dgram").Socket;
    readonly portPromise: Promise<number>;
    private onClose;
    readonly onMessage: import("rxjs").Observable<{
        message: Buffer;
        info: RemoteInfo;
        isRtpMessage: boolean;
        payloadType: number;
    }>;
    constructor(messageHandler?: RtpMessageHandler);
    addMessageHandler(handler: RtpMessageHandler): void;
    send(message: Buffer, sendTo: SocketTarget): Promise<void>;
    private cleanedUp;
    private cleanUp;
    private closed;
    close(): void;
}
