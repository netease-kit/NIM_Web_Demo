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
export declare type EventCode = 'onInvited' | 'onUserEnter' | 'onUserAccept' | 'onUserReject' | 'onUserCancel' | 'onUserBusy' | 'onUserLeave' | 'onCallingTimeOut' | 'onCameraAvailable' | 'onAudioAvailable' | 'onUserNetworkQuality' | 'onCallTypeChange' | 'onCallEnd' | 'onDisconnect' | 'onUserDisconnect' | 'onOtherClientAccept' | 'onOtherClientReject' | 'onMessageSent' | 'onJoinChannel' | 'onVideoMuted' | 'onAudioMuted' | 'onError';
export declare type Callback = {
    success?: () => void;
    failed?: RCallback;
};
export declare type SetupParams = {
    appKey: string;
};
export declare type SetCallProfile = {
    resolution?: 2 | 4 | 8 | 16;
    frameRate?: 1 | 2 | 3 | 4 | 5;
    quality?: 'speech_low_quality' | 'speech_standard' | 'music_standard' | 'standard_stereo' | 'high_quality' | 'high_quality_stereo';
    recordConfig?: RecordConfig;
};
export declare type RecordConfig = {
    isHostSpeaker: boolean;
    recordAudio: boolean;
    recordVideo: boolean;
    recordType: 0 | 1 | 2;
};
export interface LoginParams {
    account: string;
    token?: string;
    [key: string]: any;
}
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
    uid?: number;
};
export declare type MessageType = 'complete' | 'canceled' | 'rejected' | 'timeout' | 'busy';
export declare type SignalHooks = 'beforeSignalCancel' | 'beforeSignalCancelInGroupCall' | 'afterSignalJoin' | 'afterSignalJoinInGroupCall' | 'afterSignalCreateAndJoin' | 'afterSignalInvite' | 'afterSignalCancel' | 'afterSignalCancelInGroupCall' | 'afterSignalLeave' | 'afterSignalCancelInHangup' | 'afterSignalAccept' | 'afterSignalAcceptInGroupCall' | 'afterLeaveFinally' | 'afterHangupFinally' | 'signalInviteFail' | 'signalInviteFailInGroupCall' | 'signalAcceptFail' | 'whenSignalRoomJoin' | 'whenSignalRoomClose' | 'whenSignalRoomLeave' | 'whenSignalCancel' | 'whenSignalAccept' | 'whenSignalAcceptInGroupCall' | 'whenSignalInvited' | 'whenSignalReject' | 'whenSignalRejectInGroupCall' | 'whenSignalRejectIsValid' | 'whenSignalControl' | 'whenSignalRejectOtherClient' | 'whenSignalAcceptOtherClient' | 'onSignalChannelsSyncNotify' | 'callTimeOut' | 'groupCallTimeOut' | 'groupInviteTimeOut' | 'beCallTimeOut' | 'errorEvent';
export declare enum CallingStatus {
    idle = 0,
    calling = 1,
    called = 2,
    inCall = 3
}
export declare type NetworkStats = {
    uid: number;
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
    uid: number;
    account: string;
    accid?: string;
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
    uid: number;
    stream: any;
    reason?: string;
};
export declare type TokenService = (uid: number) => Promise<string>;
export interface SignallingCommon {
    call(params: {
        userId: string;
        type: CallType;
        attachment?: {
            [key: string]: any;
        };
    } & Callback): Promise<void>;
    groupCall(params: {
        userIds: string[];
        type: CallType;
        groupId?: string;
        attachment?: {
            [key: string]: any;
        };
    } & Callback): Promise<void>;
    cancel(params?: Callback): Promise<void>;
    accept(params?: Callback): Promise<void>;
    reject(params?: Callback): Promise<void>;
    hangup(params?: Callback): Promise<void>;
    groupInvite(params: {
        userIds: string[];
        groupId?: string;
        attachment?: {
            [key: string]: any;
        };
    } & Callback): Promise<void>;
    leave(params?: {
        channelId?: string;
    } & Callback): Promise<void>;
    setCallTimeout(t: number): void;
}
export interface RTCCommon {
    setupAppKey(params: SetupParams): void;
    setTokenService(cb: TokenService): void;
    setCallProfile(params: SetCallProfile): void;
    setupLocalView(view?: HTMLElement): void;
    enableLocalVideo(enabled: boolean): Promise<void>;
    enableLocalAudio(enabled: boolean): Promise<void>;
    muteLocalVideo(mute: boolean): Promise<void>;
    muteLocalAudio(mute: boolean): Promise<void>;
    getDevices(): Promise<Devices>;
    switchDevice(type: DeviceType, deviceId: string): Promise<void>;
}
export interface RTCControllerTypes extends RTCCommon {
    client: any;
    webrtc: any;
    appKey: string;
    joinRTCChannel(params: {
        channelName: string;
        type: CallType;
        uid: number;
    }): Promise<void>;
    initLocalStream(params: {
        type: CallType;
        uid: number;
    }): Promise<void>;
    rtcSubscribe(stream: any, config: StreamConfig): Promise<void>;
    rtcUnSubscribe(stream: any, config: StreamConfig): Promise<void>;
    setupRemoteView(uid: number, view?: HTMLElement): void;
    rtcLeave(): Promise<void>;
    startStreamPreview(stream: any, type: 'local' | 'remote', view?: HTMLElement): Promise<void>;
    enableLocalVideo(enabled: boolean, deviceId?: string): Promise<void>;
    enableLocalAudio(enabled: boolean, deviceId?: string): Promise<void>;
    addStream(stream: any): void;
    updateStream(stream: any): void;
    removeStream(uid: number): void;
    findRemoteView(uid: number): HTMLElement | undefined;
    setAudioMute(mute: boolean, uid: number): Promise<void>;
    removeRtcListeners(): void;
    resetState(): void;
    destroy(): void;
}
export interface SignalControllerTypes extends SignallingCommon {
    signal: any;
    channelInfo: ChannelInfo | null;
    callingUserIds: string[];
    requestId: string;
    callType: CallType | null;
    invitorChannelInfo: InvitorChannelInfo | null;
    isGroupCall: boolean;
    callStatus: number;
    callTimeout: number | undefined;
    rejectTimeout: number | undefined;
    joinChannel(channelId: string): Promise<ChannelInfo>;
    getChannelInfo(channelName: string): Promise<RoomInfo>;
    inject: (name: SignalHooks, func: (...args: any) => any) => void;
    resetState: () => void;
    destroy: () => void;
}
export interface RTCCallingTypes extends SignallingCommon, RTCCommon {
    login(params: LoginParams): void;
    logout(params?: Callback): Promise<void>;
    getSdkInstance(): any;
    getRoomInfo(): Promise<RoomInfo>;
    addDelegate(eventCode: EventCode, callback: (...args: any) => void): void;
    removeDelegate(eventCode: EventCode): void;
    switchCallType(type: CallType): Promise<void>;
    setupRemoteView(userId: string, view?: HTMLElement): void;
    setAudioMute(mute: boolean, userId: string): Promise<void>;
    destroy(): void;
}
