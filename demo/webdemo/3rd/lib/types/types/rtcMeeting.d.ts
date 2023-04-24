import { RParams, RCallback, RPromise } from './common';
export declare type UserInfo = {};
export declare type FillMode = '';
export declare type Rotation = 0;
export declare type Resolution = '';
export declare type Fps = 0;
export declare type Bitrate = 0;
export declare type MirrorType = '';
export declare type AudioQuality = '';
export declare type Command = string;
export interface RTCMeeting {
    setSelfProfile(params: {
        userName?: string;
        avatar?: string;
    }, callback?: RCallback): RPromise;
    createMeeting(roomId: string, callback?: RCallback): RPromise;
    destroyMeeting(roomId: string, callback?: RCallback): RPromise;
    enterMeeting(roomId: string, callback?: RCallback): RPromise;
    leaveMeeting(callback?: RCallback): RPromise;
    getUserInfoList(callback?: RCallback<RParams & {
        userList: UserInfo[];
    }>): RPromise<RParams & {
        userList: UserInfo[];
    }>;
    getUserInfo(userId: string, callback?: RCallback<RParams & {
        userInfo: UserInfo;
    }>): RPromise<RParams & {
        userInfo: UserInfo;
    }>;
    startRemoteView(userId: string, view: HTMLElement, callback?: RCallback): RPromise;
    setRemoteViewFillMode(userId: string, fillMode: FillMode, callback?: RCallback): RPromise;
    setRemoteViewRotation(userId: string, rotation: Rotation, callback?: RCallback): RPromise;
    muteRemoteAudio(userId: string, mute: boolean, callback?: RCallback): RPromise;
    muteRemoteVideoStream(userId: string, mute: boolean, callback?: RCallback): RPromise;
    startCameraPreview(view: HTMLElement, callback?: RCallback): RPromise;
    stopCameraPreview(): RPromise;
    setVideoResolution(resolution: Resolution, callback?: RCallback): RPromise;
    setVideoFps(fps: Fps, callback?: RCallback): RPromise;
    setVideoBitrate(bitrate: Bitrate, callback?: RCallback): RPromise;
    setLocalViewMirror(type: MirrorType, callback?: RCallback): RPromise;
    startMicrophone(callback?: RCallback): RPromise;
    stopMicrophone(callback?: RCallback): RPromise;
    setAudioQuality(quality: AudioQuality, callback?: RCallback): RPromise;
    muteLocalAudio(mute: boolean, callback?: RCallback): RPromise;
    setSpeaker(useSpeaker: boolean, callback?: RCallback): RPromise;
    setAudioCaptureVolume(volume: number, callback?: RCallback): RPromise;
    setAudioPlayoutVolume(volume: number, callback?: RCallback): RPromise;
    startFileDumping(params: {
        filePath: string;
    }, callback?: RCallback): RPromise;
    stopFileDumping(callback?: RCallback): RPromise;
    enableAudioEvaluation(enable: boolean, callback?: RCallback): RPromise;
    startScreenCapture(params: {}, callback?: RCallback): RPromise;
    stopScreenCapture(callback?: RCallback): RPromise;
    pauseScreenCapture(callback?: RCallback): RPromise;
    resumeScreenCapture(callback?: RCallback): RPromise;
    getLiveBroadcastingURL(callback?: RCallback<RParams & {
        url: string;
    }>): RPromise<RParams & {
        url: string;
    }>;
    getBeautyManager(): unknown;
    sendRoomTextMsg?(message: string, callback?: RCallback): RPromise;
    sendRoomCustomMsg?(command: Command, message: string, callback?: RCallback): RPromise;
}
