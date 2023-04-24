export declare type CallType = 1 | 2 | 3;
export declare type Code = string | number;
export declare type Message = string;
export declare type RParams = {
    code: Code;
    message?: Message;
};
export declare type ErrorMessage = {
    code: string;
    message: string;
};
export declare type RCallback<T = RParams> = (params: T) => void;
export declare type RPromise<T = RParams> = Promise<T>;
export declare type EventCode = 'onInvited' | 'onUserEnter' | 'onUserAccept' | 'onUserReject' | 'onUserCancel' | 'onUserBusy' | 'onUserLeave' | 'onCallingTimeOut' | 'onCameraAvailable' | 'onAudioAvailable' | 'onUserNetworkQuality' | 'onCallTypeChange' | 'onCallEnd' | 'onDisconnect' | 'onUserDisconnect' | 'onOtherClientAccept' | 'onOtherClientReject' | 'onMessageSent' | 'onError';
export declare type ConnectStatus = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'DISCONNECTING';
export declare type Callback = {
    success?: () => void;
    failed?: RCallback;
};
export declare type SetupParams = {
    appKey: string;
    resolution?: 2 | 4 | 8 | 16;
    frameRate?: 1 | 2 | 3 | 4 | 5;
    quality?: 'speech_low_quality' | 'speech_standard' | 'music_standard' | 'standard_stereo' | 'high_quality' | 'high_quality_stereo';
};
export declare type LoginParams = {
    account: string;
    token?: string;
} & Callback & {
    [key: string]: any;
};
export declare type DeviceItem = {
    label: string;
    deviceId: string;
    active?: boolean;
};
export declare type Devices = {
    audioIn: DeviceItem[];
    audioOut: DeviceItem[];
    video: DeviceItem[];
};
export declare type DeviceType = 'microphoneId' | 'cameraId' | 'speakerId';
export declare type ChannelInfo = {
    ext?: string;
    channelId: string;
    channelName: string;
    type: CallType;
    createTimestamp: number;
    expireTimestamp: number;
    creatorId: string;
    invalid: boolean;
};
export declare type RoomInfo = {
    channelName: string;
    channelId: string;
    channelCreateTime: string;
    channelExpireTime: string;
    creator: string;
    members: Member[];
    uid: string;
};
export declare type MessageType = 'complete' | 'canceled' | 'rejected' | 'timeout' | 'busy';
export declare enum CallingStatus {
    idle = 0,
    calling = 1,
    called = 2,
    inCall = 3
}
export declare type NetworkStats = {
    uid: string;
    uplinkNetworkQuality: number;
    downlinkNetworkQuality: number;
};
export declare type Duration = {
    accid: string;
    duration?: number;
};
export declare type BaseOptions = {
    debug: boolean;
};
export declare type InvitorChannelInfo = Pick<ChannelInfo, 'channelId' | 'channelName' | 'creatorId'> & {
    requestId: number;
    from: string;
    type: CallType;
};
export declare type Member = {
    uid: string;
    account: string;
    createTimestamp?: number;
    expireTimestamp?: number;
};
export declare type PushInfo = {
    pushTitle: string;
    pushContent: string;
    pushPayload?: {};
    needPush: boolean;
    needBadge: boolean;
};
export declare type StreamConfig = {
    audio: boolean;
    video: boolean;
};
export declare type ChannelEvent = {
    eventType: string;
    channelName: string;
    channelId: string;
    channelCreateTime: string;
    channelExpireTime: string;
    creator: string;
    from: string;
    attach: string;
    attachExt: string;
    time: number;
    members: Member[];
    pushInfo: PushInfo;
    requestId: number;
    to: string;
    channelInValid: boolean;
    type: CallType;
    msgid: number;
};
export declare type RTCEvent = {
    uid: string;
    stream: any;
    reason?: string;
};
export declare type TokenService = (uid: string) => Promise<string>;
export interface SignallingCommon {
    login(params: LoginParams): Promise<void>;
    logout(params?: Callback): Promise<void>;
    call(params: {
        userId: string;
        type: CallType;
    } & Callback): Promise<void>;
    groupCall(params: {
        userIds: string[];
        type: CallType;
        groupId?: string;
    } & Callback): Promise<void>;
    cancel(params?: Callback): Promise<void>;
    accept(params?: Callback): Promise<void>;
    reject(params?: Callback): Promise<void>;
    hangup(params?: Callback): Promise<void>;
    leave(params?: Callback): Promise<void>;
    setCallTimeout(t: number): void;
}
export interface RTCCommon {
    setupAppKey(params: SetupParams): void;
    setTokenService(cb: TokenService): void;
    setupLocalView(view?: HTMLElement): void;
    setupRemoteView(userId: string, view?: HTMLElement): void;
    enableLocalVideo(enabled: boolean): Promise<void>;
    muteLocalAudio(mute: boolean): Promise<void>;
    selectSpeakers(deviceId: string): Promise<void>;
    getDevices(): Promise<Devices>;
    switchDevice(type: DeviceType, deviceId: string): Promise<void>;
    setAudioMute(mute: boolean, userId: string): Promise<void>;
}
export interface RTCControllerTypes extends RTCCommon {
    client: any;
    webrtc: any;
    appKey: string;
    joinRTCChannel(params: {
        channelName: string;
        type: CallType;
        uid: string;
    }): Promise<void>;
    initLocalStream(params: {
        type: CallType;
        uid: string;
    }): Promise<void>;
    rtcSubscribe(stream: any, config: StreamConfig): Promise<void>;
    rtcUnSubscribe(stream: any, config: StreamConfig): Promise<void>;
    setupRemoteView(uid: string, view?: HTMLElement): void;
    rtcLeave(): Promise<void>;
    startStreamPreview(stream: any, type: 'local' | 'remote', view?: HTMLElement): Promise<void>;
    enableLocalVideo(enabled: boolean, deviceId?: string): Promise<void>;
    muteLocalAudio(mute: boolean, deviceId?: string): Promise<void>;
    addStream(stream: any): void;
    updateStream(stream: any): void;
    removeStream(uid: string): void;
    findRemoteView(uid: string): HTMLElement | undefined;
    destroy(): void;
}
