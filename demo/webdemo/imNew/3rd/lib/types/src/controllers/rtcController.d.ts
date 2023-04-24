import { RTCControllerTypes, CallType, SetupParams, SetCallProfile, Devices, DeviceType, BaseOptions, StreamConfig, TokenService } from '../types';
import BaseController from './baseController';
declare class RTCController extends BaseController implements RTCControllerTypes {
    client: any;
    webrtc: any;
    appKey: string;
    private localStream;
    private remoteStreams;
    private localView;
    private remoteViews;
    private microphoneId;
    private cameraId;
    private speakerId;
    private audioEnabled;
    private videoEnabled;
    private getTokenFunc;
    private resolution;
    private frameRate;
    private quality;
    private recordConfig?;
    constructor(options: BaseOptions);
    /**
     * 初始化G2
     * @param params
     */
    setupAppKey({ appKey }: SetupParams): void;
    /**
     * 设置获取token的异步函数，在加入RTC之前调用
     * @param cb 获取token的异步函数
     */
    setTokenService(cb: TokenService): void;
    /**
     * 为一通通话设置一些通话参数
     * @param params
     */
    setCallProfile(params: SetCallProfile): void;
    /**
     * 设置自己画面，在播放之前调用
     * @param view 位于的DOM节点
     */
    setupLocalView(view?: HTMLElement): void;
    /**
     * 设置其他用户画面，在播放之前调用
     * @param uid
     * @param view 位于的DOM节点
     */
    setupRemoteView(uid: number, view?: HTMLElement): void;
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
     * 设置远端音频静音
     * @param mute true 关闭 false 开启
     * @param uid
     */
    setAudioMute(mute: boolean, uid: number): Promise<void>;
    /**
     * 本端加入G2的房间
     * 创建本地流并初始化本地流
     * 发布本地流
     * @param param
     */
    joinRTCChannel({ channelName, type, uid, }: {
        channelName: string;
        type: CallType;
        uid: number;
    }): Promise<void>;
    /**
     * 初始化本地流
     * @param param
     */
    initLocalStream({ type, uid, }: {
        type: CallType;
        uid: number;
    }): Promise<void>;
    /**
     * 订阅G2流
     * @param stream
     */
    rtcSubscribe(stream: any, config: StreamConfig): Promise<void>;
    /**
     * 取消订阅G2流
     * @param stream
     * @param config
     */
    rtcUnSubscribe(stream: any, config: StreamConfig): Promise<void>;
    /**
     * 离开G2房间
     */
    rtcLeave(): Promise<void>;
    /**
     * 播放流
     * @param stream
     * @param type
     * @param view
     */
    startStreamPreview(stream: any, type: 'local' | 'remote', view?: HTMLElement): Promise<void>;
    /**
     * 开启/关闭摄像头
     * @param enabled true 打开 false 关闭
     * @param deviceId [可选] 设备id
     */
    enableLocalVideo(enabled: boolean, deviceId?: string): Promise<void>;
    /**
     * 开启/关闭麦克风
     * @param enabled true 打开 false 关闭
     * @param deviceId [可选] 设备id
     */
    enableLocalAudio(enabled: boolean, deviceId?: string): Promise<void>;
    muteLocalVideo(mute: boolean): Promise<void>;
    muteLocalAudio(mute: boolean): Promise<void>;
    /**
     * 新增流，如果以存在，则更新流
     * @param stream
     */
    addStream(stream: any): void;
    /**
     * 更新流
     * @param stream
     */
    updateStream(stream: any): void;
    /**
     * 删除流
     * @param uid
     */
    removeStream(uid: number): void;
    /**
     * 根据uid查找对应的视图
     * @param uid
     */
    findRemoteView(uid: number): HTMLElement | undefined;
    /**
     * 重置一通通话的状态
     */
    resetState(): void;
    removeRtcListeners(): void;
    destroy(): void;
    /**
     * 选择扬声器
     * @param deviceId 设备id
     */
    private selectSpeakers;
    private _selectSpeakers;
}
export default RTCController;
