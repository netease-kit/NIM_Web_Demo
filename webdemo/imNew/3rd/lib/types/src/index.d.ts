import { LoginParams, EventCode, CallType, Callback, RoomInfo, BaseOptions, Devices, DeviceType, SetupParams, TokenService, SetCallProfile } from './types';
import BaseController from './controllers/baseController';
import SignalController from './controllers/signalController';
import { RTCCallingTypes } from './types';
export { SignalController };
declare class RTCCalling extends BaseController implements RTCCallingTypes {
    static version: string;
    static instance: RTCCalling | null;
    private signal;
    private rtcController;
    private signalController;
    private isConnect;
    private account;
    private uid;
    private durations;
    private userMap;
    private eventBound;
    private otherClients;
    constructor({ debug }?: Partial<BaseOptions>);
    /**
     * 初始化G2，需要在login之前调用，只需调用一次
     * @param options
     */
    setupAppKey(options: SetupParams): void;
    /**
     * 登录IM，所有功能先进行登录才能使用
     * 用户若已经在 app 内实现了 IM 登录/登出逻辑，需要使用该方法替换，参数跟以前保持一致
     * @param params
     */
    login({ account, token, ...opt }: LoginParams): void;
    /**
     * 登出IM
     * @param params
     */
    logout(params?: Callback): Promise<void>;
    /**
     * 销毁组件
     */
    destroy(): void;
    /**
     * 设置TokenService，在call
     * 若 G2 sdk 采用安全模式则加入音视频房间时需要提供对应的 token，详细参考[Token 获取](https://doc.yunxin.163.com/docs/jcyOTA0ODM/TQ0MTI2ODQ?platformId=50002)。
     * 呼叫组件依赖 token，需要在用户在初始化时同时设置 token 服务，此 token 服务为用户服务端自己实现。若 G2 sdk 采用非安全模式，则无需调用该接口。
     * @param cb 获取token的异步函数
     */
    setTokenService(cb: TokenService): void;
    /**
     * 设置通话参数，在发起呼叫或接受呼叫前调用
     * @param params
     */
    setCallProfile(params: SetCallProfile): void;
    /**
     * 设置呼叫超时时间，在发起呼叫或接受呼叫前调用
     * @param t 超时时间，单位ms
     */
    setCallTimeout(t: number): void;
    /**
     * 设置本端视频播放节点，在发起呼叫或接受呼叫前调用
     * @param view 位于的DOM节点
     */
    setupLocalView(view?: HTMLElement): void;
    /**
     * 设置远端视频播放节点，在发起呼叫或接受呼叫前调用
     * @param userId IM的account账号
     * @param view 位于的DOM节点
     */
    setupRemoteView(userId: string, view?: HTMLElement): void;
    /**
     * 注册事件监听
     * @param eventCode
     * @param callback
     */
    addDelegate(eventCode: EventCode, callback: (...args: any) => void): void;
    /**
     * 移除事件监听
     * @param eventCode
     */
    removeDelegate(eventCode: EventCode): void;
    /**
     * 发起一对一呼叫
     * @param params
     */
    call(params: {
        userId: string;
        type: CallType;
        attachment?: {
            [key: string]: any;
        };
    } & Callback): Promise<void>;
    /**
     * 发起多人呼叫
     * @param params
     */
    groupCall(params: {
        userIds: string[];
        type: CallType;
        groupId?: string;
        attachment?: {
            [key: string]: any;
        };
    } & Callback): Promise<void>;
    /**
     * 取消呼叫
     * 当发起呼叫成功后，可以调用该接口取消呼叫
     * @param params
     */
    cancel(params?: Callback): Promise<void>;
    /**
     * 接受呼叫
     * 当收到呼叫邀请后，可以调用该接口接受呼叫
     * @param params
     */
    accept(params?: Callback): Promise<void>;
    /**
     * 拒绝呼叫
     * 当收到呼叫邀请后，可以调用该接口拒绝呼叫
     * @param params
     */
    reject(params?: Callback): Promise<void>;
    /**
     * 离开通话
     * 不影响通话中的其他人
     * @param params
     */
    leave(params?: {
        channelId?: string;
    } & Callback): Promise<void>;
    /**
     * 挂断通话
     * 会关闭该通通话
     * @param params
     */
    hangup(params?: Callback): Promise<void>;
    /**
     * 通话中邀请其他人进入通话
     * 在多人通话发起或者接通后，可以调用该方法继续邀请其他人进入通话
     * @param params
     */
    groupInvite(params: {
        userIds: string[];
        groupId?: string;
        attachment?: {
            [key: string]: any;
        };
    } & Callback): Promise<void>;
    /**
     * 开启/关闭摄像头
     * @param enabled true 打开 false 关闭
     */
    enableLocalVideo(enabled: boolean): Promise<void>;
    /**
     * 开启/关闭麦克风
     * @param enabled true 打开 false 关闭
     */
    enableLocalAudio(enabled: boolean): Promise<void>;
    /**
     * 禁用本地视频轨道
     * @param mute true 禁用 false 开启
     */
    muteLocalVideo(mute: boolean): Promise<void>;
    /**
     * 禁用本地音频轨道
     * @param mute true 禁用 false 开启
     */
    muteLocalAudio(mute: boolean): Promise<void>;
    /**
     * 切换通话类型
     * @param type CallType
     */
    switchCallType(type: CallType): Promise<void>;
    /**
     * 禁用远端音频轨道
     * @param mute true 禁用 false 开启
     * @param userId IM的account账号
     */
    setAudioMute(mute: boolean, userId: string): Promise<void>;
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
     * 获取房间信息
     */
    getRoomInfo(): Promise<RoomInfo>;
    /**
     * 获取sdk实例
     */
    getSdkInstance(): {
        signal: any;
        rtcClient: any;
        WebRTC2: any;
    };
    /**
     * 离开G2房间
     */
    private rtcLeave;
    /**
     * 设置本端uid
     * @param uid
     */
    private setLocalUid;
    /**
     * 退出登录的工作
     */
    private logoutHandler;
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
     * 重置状态
     */
    private resetRtcState;
    private rtcLeaveAndResetState;
    private addSignalHooks;
    /**
     * 注册信令和G2的事件监听
     */
    private addRtcListeners;
    private roomJoinHandler;
    private leaveHandler;
    private controlHandler;
    static getInstance({ debug }?: Partial<BaseOptions>): RTCCalling;
}
export default RTCCalling;
