import { RParams, RCallback, RPromise } from './common';
export declare type Command = string;
export declare type Reason = string;
export declare type RoomInfo = {};
export declare type UserInfo = {};
export declare type ReverbType = {};
export declare type VoiceChangerType = {};
export interface LiveRoom {
    createRoom(roomId: number, roomParam: {}, callback?: RCallback): RPromise;
    destroyRoom(callback?: RCallback): RPromise;
    enterRoom(roomId: number, callback?: RCallback): RPromise;
    exitRoom(callback?: RCallback): RPromise;
    getRoomInfos(roomIds: number[], callback?: RCallback<RParams & {
        roomList?: RoomInfo[];
    }>): RPromise<RParams & {
        roomList?: RoomInfo[];
    }>;
    getAnchorList(callback?: RCallback<RParams & {
        userList?: UserInfo[];
    }>): RPromise<RParams & {
        userList?: UserInfo[];
    }>;
    getAudienceList(callback?: RCallback<RParams & {
        userList?: UserInfo[];
    }>): RPromise<RParams & {
        userList?: UserInfo[];
    }>;
    startCameraPreview(view: HTMLElement, callback?: RCallback): RPromise;
    stopCameraPreview(callback?: RCallback): RPromise;
    startPublish(streamUrl: string, callback?: RCallback): RPromise;
    stopPublish(callback?: RCallback): RPromise;
    startPlay(userId: string, view: HTMLElement, callback?: RCallback): RPromise;
    stopPlay(userId: string, callback?: RCallback): RPromise;
    setMirror(isMirror: boolean, callback?: RCallback): RPromise;
    muteLocalAudio(isMuted: boolean, callback?: RCallback): RPromise;
    muteRemoteAudio(userId: string, isMuted: boolean, callback?: RCallback): RPromise;
    muteAllRemoteAudio(isMuted: boolean, callback?: RCallback): RPromise;
    getAudioEffectManager(): unknown;
    getBeautyManager(): unknown;
    playBgm(params: {
        url: string;
        progress?: RCallback<{
            progressMs: number;
            duration: number;
        }>;
        completion?: RCallback;
    }): RPromise;
    stopBgm(callback?: RCallback): RPromise;
    pauseBgm(callback?: RCallback): RPromise;
    resumeBgm(callback?: RCallback): RPromise;
    setBgmVolume(volume: number, callback?: RCallback): RPromise;
    setBgmPosition(pos: number, callback?: RCallback): RPromise;
    setMicVolume(volume: number, callback?: RCallback): RPromise;
    setReverbType(reverbType: ReverbType, callback?: RCallback): RPromise;
    setVoiceChangerType(voiceChangerType: VoiceChangerType, callback?: RCallback): RPromise;
    playAudioEffect(params: {
        effectId: number;
        path: string;
        count: number;
        publish: boolean;
        volume: number;
    }, callback?: RCallback): RPromise;
    pauseAudioEffect(effectId: number, callback?: RCallback): RPromise;
    resumeAudioEffect(effectId: number, callback?: RCallback): RPromise;
    stopAudioEffect(effectId: number, callback?: RCallback): RPromise;
    stopAllAudioEffects(callback?: RCallback): RPromise;
    setAudioEffectVolume(effectId: number, volume: number, callback?: RCallback): RPromise;
    setAllAudioEffectsVolume(volume: number, callback?: RCallback): RPromise;
    showVideoDebugLog(isShow?: boolean, callback?: RCallback): RPromise;
    onError(callback: RCallback): void;
    onWarning(callback: RCallback): void;
    onDebugLog(callback: RCallback<{
        log: string;
    }>): void;
    onRoomDestroy(callback: RCallback<{
        roomId: number;
    }>): void;
    onRoomInfoChange(callback: RCallback<{
        info: RoomInfo;
    }>): void;
    onAnchorEnter(callback: RCallback<{
        userId: string;
    }>): void;
    onAnchorExit(callback: RCallback<{
        userId: string;
    }>): void;
    onAudienceEnter(callback: RCallback<{
        user: UserInfo;
    }>): void;
    onAudienceExit(callback: RCallback<{
        user: UserInfo;
    }>): void;
    onRequestJoinAnchor(callback: RCallback<{
        user: UserInfo;
        reason?: Reason;
        timeout: number;
    }>): void;
    onKickoutJoinAnchor(callback: RCallback<null>): void;
    onRecvRoomTextMsg(callback: RCallback<{
        message: string;
        user: UserInfo;
    }>): void;
    onRecvRoomCustomMsg(callback: RCallback<{
        command: Command;
        message: string;
        user: UserInfo;
    }>): void;
    onRequestRoomPK?(callback: RCallback<{
        user: UserInfo;
        timeout: number;
    }>): void;
    onQuitRoomPK?(callback: RCallback<null>): void;
    sendRoomTextMsg?(message: string, callback?: RCallback): RPromise;
    sendRoomCustomMsg?(command: Command, message: string, callback?: RCallback): RPromise;
    requestJoinAnchor?(callback: RCallback<{
        agreed: boolean;
        reason?: Reason;
    }>, reason?: Reason): RPromise<{
        agreed: boolean;
        reason?: Reason;
    }>;
    responseJoinAnchor?(userId: string, agree: boolean, reason?: Reason, callback?: RCallback): RPromise;
    kickoutJoinAnchor?(userId: string, callback?: RCallback): RPromise;
    requestRoomPK?(roomId: number, userId: string, callback?: RCallback<{
        agreed: boolean;
        reason?: Reason;
    }>): RPromise<{
        agreed: boolean;
        reason?: Reason;
    }>;
    responseRoomPK?(userId: string, agree: boolean, reason?: Reason, callback?: RCallback): RPromise;
    quitRoomPK?(callback?: RCallback): RPromise;
}
