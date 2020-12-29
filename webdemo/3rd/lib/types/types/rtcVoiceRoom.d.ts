import { RParams, RCallback, RPromise } from './common';
export declare type RoomInfo = {};
export declare type UserInfo = {};
export declare type AudioQuality = '';
export declare type Command = '';
export interface RTCVoiceRoom {
    setSelfProfile(params: {
        userName?: string;
        avatar?: string;
    }, callback?: RCallback): RPromise;
    createRoom(roomId: number, roomParam: {}, callback?: RCallback): RPromise;
    destroyRoom(callback?: RCallback): RPromise;
    enterRoom(roomId: string, callback?: RCallback): RPromise;
    exitRoom(callback?: RCallback): RPromise;
    getRoomInfoList(roomIds: number[], callback?: RCallback<RParams & {
        roomList?: RoomInfo[];
    }>): RPromise<RParams & {
        roomList?: RoomInfo[];
    }>;
    getUserInfoList(userIds: string[], callback?: RCallback<RParams & {
        userList: UserInfo[];
    }>): RPromise<RParams & {
        userList: UserInfo[];
    }>;
    enterSeat(seatIndex: number, callback?: RCallback): RPromise;
    leaveSeat(callback?: RCallback): RPromise;
    pickSeat(seatIndex: number, userId: string, callback?: RCallback): RPromise;
    kickSeat(seatIndex: number, callback?: RCallback): RPromise;
    muteSeat(seatIndex: number, isMute: boolean, callback?: RCallback): RPromise;
    closeSeat(seatIndex: number, isClose: boolean, callback?: RCallback): RPromise;
    startMicrophone(callback?: RCallback): RPromise;
    stopMicrophone(callback?: RCallback): RPromise;
    setAudioQuality(quality: AudioQuality, callback?: RCallback): RPromise;
    muteLocalAudio(mute: boolean, callback?: RCallback): RPromise;
    setSpeaker(useSpeaker: boolean, callback?: RCallback): RPromise;
    setAudioCaptureVolume(volume: number, callback?: RCallback): RPromise;
    setAudioPlayoutVolume(volume: number, callback?: RCallback): RPromise;
    muteRemoteAudio(userId: string, mute: boolean, callback?: RCallback): RPromise;
    muteAllRemoteAudio(mute: boolean, callback?: RCallback): RPromise;
    getAudioEffectManager(): unknown;
    sendRoomTextMsg?(message: string, callback?: RCallback): RPromise;
    sendRoomCustomMsg?(command: Command, message: string, callback?: RCallback): RPromise;
    sendInvitation(command: Command, userId: string, content: string, callback?: RCallback<RParams & {
        inviteId: string;
    }>): RPromise<RParams & {
        inviteId: string;
    }>;
    acceptInvitation(id: string, callback?: RCallback): RPromise;
    rejectInvitation(id: string, callback?: RCallback): RPromise;
    cancelInvitation(id: string, callback?: RCallback): RPromise;
}
