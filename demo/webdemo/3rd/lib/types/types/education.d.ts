import { RParams, RCallback, RPromise } from './common';
export declare type Role = 'teacher' | 'student';
export declare type ShareInfo = {};
export declare type CameraInfo = {};
export declare type MicrophoneInfo = {};
export interface Education {
    createRoom(params: {
        classId: number;
        nickName: string;
        avatar?: string;
    }, callback?: RCallback): RPromise;
    destroyRoom(classId: number, callback?: RCallback): RPromise;
    enterRoom(params: {
        classId: number;
        role: Role;
        nickName?: string;
        avatar?: string;
    }): RPromise;
    exitRoom(classId: number, role: Role, callback?: RCallback): RPromise;
    inviteToPlatform(userId: string, callback?: RCallback): RPromise;
    finishAnswering(userId: string, callback?: RCallback): RPromise;
    stopQuestionTime(classId: number, callback?: RCallback): RPromise;
    getScreenShareList(callback?: RCallback<RParams & {
        shareList: ShareInfo[];
    }>): RPromise<RParams & {
        shareList: ShareInfo[];
    }>;
    startScreenCapture(params: {
        type: number;
        sourceId: string;
        sourceName: string;
    }, callback?: RCallback): RPromise;
    startRemoteView(params: {
        userId: string;
        streamType: number;
        view: HTMLElement;
    }, callback?: RCallback): RPromise;
    stopRemoteView(params: {
        userId: string;
        streamType: number;
    }, callback?: RCallback): RPromise;
    sendTextMessage(classId: number, message: string, callback?: RCallback): RPromise;
    sendCustomMessage(userId: string, data: string, callback?: RCallback): RPromise;
    sendGroupCustomMessage(classId: string, data: string, callback?: RCallback): RPromise;
    openCamera(view: HTMLElement, callback?: RCallback): RPromise;
    closeCamera(view: HTMLElement, callback?: RCallback): RPromise;
    getCameraList(callback?: RCallback<RParams & {
        cameraList: CameraInfo[];
    }>): RPromise<RParams & {
        cameraList: CameraInfo[];
    }>;
    setCurrentCamera(deviceId: string, callback?: RCallback): RPromise;
    openMicrophone(callback?: RCallback): RPromise;
    closeMicrophone(callback?: RCallback): RPromise;
    getMicrophoneList(callback?: RCallback<RParams & {
        microphoneList: MicrophoneInfo[];
    }>): RPromise<RParams & {
        microphoneList: MicrophoneInfo[];
    }>;
    setCurrentMicDevice(micId: string, callback?: RCallback): RPromise;
    setBeautyStyle(params: {
        beautyStyle: number;
        beauty: number;
        white: number;
        ruddiness: number;
    }, callback?: RCallback): RPromise;
    startQuestionTime(classId: number, callback?: RCallback): RPromise;
    raiseHand(callback?: RCallback): RPromise;
}
