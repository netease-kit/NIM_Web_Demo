import { LoginParams, EventCode, CallType, Callback, RoomInfo, BaseOptions, Devices, DeviceType, SetupParams, TokenService } from '../types/common';
import BaseController from '../controllers/baseController';
import { RTCCalling as RTCCallingTypes } from '../types/rtcCalling';
declare class RTCCalling extends BaseController implements RTCCallingTypes {
    static version: string;
    static instance: RTCCalling;
    private signal;
    private isConnect;
    private channelInfo;
    private callingUserIds;
    private requestId;
    private callType;
    private account;
    private uid;
    private invitorChannelInfo;
    private isGroupCall;
    private callStatus;
    private durations;
    private userMap;
    private callTimeout;
    private rejectTimeout;
    private rtc;
    private eventBound;
    constructor({ debug }?: Partial<BaseOptions>);
    /**
     * 初始化G2，需要在login之前调用
     * @param params
     */
    setupAppKey(options: SetupParams): void;
    /**
     * 登录IM，所有功能先进行登录才能使用
     * @param params
     */
    login({ account, token, success, failed, ...opt }: LoginParams): Promise<void>;
    /**
     * 登出IM
     * @param params
     */
    logout(params?: Callback): Promise<void>;
    /**
     * 设置获取token的异步函数，在加入RTC之前调用
     * @param cb 获取token的异步函数
     */
    setTokenService(cb: TokenService): void;
    /**
     * 注册代理
     * @param eventCode
     * @param callback
     */
    addDelegate(eventCode: EventCode, callback: (...args: any) => void): void;
    /**
     * 移除代理
     * @param eventCode
     */
    removeDelegate(eventCode: EventCode): void;
    /**
     * 单人呼叫
     * @param params
     */
    call(params: {
        userId: string;
        type: CallType;
    } & Callback): Promise<void>;
    /**
     * 多人呼叫
     * @param params
     */
    groupCall(params: {
        userIds: string[];
        type: CallType;
        groupId?: string;
    } & Callback): Promise<void>;
    /**
     * 1对1取消呼叫
     * @param params
     */
    cancel(params?: Callback): Promise<void>;
    /**
     * 接受呼叫
     * @param params
     */
    accept(params?: Callback): Promise<void>;
    /**
     * 拒绝呼叫
     * @param params
     */
    reject(params?: Callback): Promise<void>;
    /**
     * 离开，不影响通话中的其他人
     * @param params
     */
    leave(params?: Callback): Promise<void>;
    /**
     * 挂断，同时挂断其他人
     * @param params
     */
    hangup(params?: Callback): Promise<void>;
    /**
     * 开启/关闭摄像头
     * @param enabled true 打开 false 关闭
     */
    enableLocalVideo(enabled: boolean): Promise<void>;
    /**
     * 开启/关闭麦克风
     * @param mute true 关闭 false 开启
     */
    muteLocalAudio(mute: boolean): Promise<void>;
    /**
     * 切换通话类型
     * @param type CallType
     */
    switchCallType(type: CallType): Promise<void>;
    /**
     * 设置远端音频静音
     * @param mute true 关闭 false 开启
     * @param userId IM的account账号
     */
    setAudioMute(mute: boolean, userId: string): Promise<void>;
    /**
     * 设置自己画面，在播放之前调用
     * @param view 位于的DOM节点
     */
    setupLocalView(view?: HTMLElement): void;
    /**
     * 设置其他用户画面，在播放之前调用
     * @param userId IM的account账号
     * @param view 位于的DOM节点
     */
    setupRemoteView(userId: string, view?: HTMLElement): void;
    /**
     * 选择扬声器
     * @param deviceId 设备id
     */
    selectSpeakers(deviceId: string): Promise<void>;
    /**
     * 获取设备列表
     */
    getDevices(): Promise<Devices>;
    /**
     * 切换设备
     * @param type 设备类型
     * @param deviceId 设备id
     */
    switchDevice(type: DeviceType, deviceId: string): Promise<void>;
    /**
     * 设置呼叫超时时间，在呼叫前调用
     * @param t 超时时间，单位ms
     */
    setCallTimeout(t: number): void;
    /**
     * 获取房间信息
     */
    getRoomInfo(): Promise<RoomInfo>;
    /**
     * 获取sdk实例
     */
    getSdkInstance(): any;
    /**
     * 创建信令
     */
    private signalCreate;
    /**
     * 单邀
     * @param userId IM的account账号
     */
    private signalInvite;
    /**
     * 群邀
     */
    private signalGroupInvite;
    /**
     * 取消呼叫中的信令
     */
    private signalCancel;
    /**
     * 离开信令房间
     */
    private signalLeave;
    /**
     * 退出信令
     */
    private signalClose;
    /**
     * 本端加入信令和G2
     */
    private joinSignalAndRTC;
    /**
     * 离开G2房间
     */
    private rtcLeave;
    /**
     * 接受信令邀请
     * 如果是多人通话，需要加入RTC房间
     */
    private acceptSignal;
    /**
     * 拒绝通话
     * @param isBusy
     */
    private rejectCall;
    /**
     * 设置本端uid
     * @param uid
     */
    private setLocalUid;
    /**
     * 移除本端uid
     */
    private removeLocalUid;
    /**
     * 更新通话中的用户数
     * @param members
     */
    private filterCallingUserByMembers;
    /**
     * 根据userId查找uid
     * @param userId IM的account账号
     */
    private findUid;
    /**
     * 单人通话下，需要通知服务端退出的情况
     * @param userId IM的account账号
     * @param status
     */
    private sendMessage;
    /**
     * 批量标记消息已读
     * @param events
     */
    private batchMarkEvent;
    /**
     * 重置状态
     */
    private resetChannel;
    private destroy;
    /**
     * 注册信令和G2的事件监听
     */
    private addEventListener;
    private signalRoomJoinHandler;
    private roomCloseHandler;
    private roomJoinHandler;
    private acceptHandler;
    private inviteHandler;
    private cancelInviteHandler;
    private rejectHandler;
    private controlHandler;
    private leaveHandler;
    static getInstance({ debug }?: Partial<BaseOptions>): RTCCalling;
}
export default RTCCalling;
