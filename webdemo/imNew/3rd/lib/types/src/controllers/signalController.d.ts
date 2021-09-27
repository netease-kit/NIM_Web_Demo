import BaseController from './baseController';
import { CallType, CallingStatus, BaseOptions, ChannelInfo, InvitorChannelInfo, Callback, SignalControllerTypes, SignalHooks, RoomInfo } from '../types';
declare class SignalController extends BaseController implements SignalControllerTypes {
    signal: any;
    channelInfo: ChannelInfo | null;
    callingUserIds: string[];
    requestId: string;
    callType: CallType | null;
    invitorChannelInfo: InvitorChannelInfo | null;
    isGroupCall: boolean;
    callStatus: CallingStatus;
    callTimeout: number | undefined;
    rejectTimeout: number | undefined;
    private callTimer;
    private rejectTimer;
    private aliveTimer;
    private hooks;
    constructor(signal: any, options: BaseOptions);
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
    /**
     * 接受呼叫
     * @param params
     */
    accept(params?: Callback): Promise<void>;
    /**
     * 取消呼叫
     * @param params
     */
    cancel(params?: Callback): Promise<void>;
    /**
     * 拒绝呼叫
     * @param params
     */
    reject(params?: Callback): Promise<void>;
    /**
     * 离开，不影响通话中的其他人
     * @param params
     */
    leave(params?: {
        channelId?: string;
    } & Callback): Promise<void>;
    /**
     * 挂断，同时挂断其他人
     * @param params
     */
    hangup(params?: Callback): Promise<void>;
    /**
     * 通话中邀请其他人，只能在群呼中使用
     */
    groupInvite(params: {
        userIds: string[];
        groupId?: string;
        attachment?: {
            [key: string]: any;
        };
    } & Callback): Promise<void>;
    /**
     * 设置呼叫超时时间，在呼叫前调用
     * @param t 超时时间，单位ms
     */
    setCallTimeout(t: number): void;
    resetState(): void;
    joinChannel(channelId: string): Promise<ChannelInfo>;
    getChannelInfo(channelName: string): Promise<RoomInfo>;
    destroy(): void;
    inject(name: SignalHooks, func: (...args: any) => any): void;
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
     * 接受信令邀请
     * 如果是多人通话，需要加入RTC房间
     */
    private acceptSignal;
    /**
     * 离开信令房间
     */
    private signalLeave;
    /**
     * 退出信令
     */
    private signalClose;
    /**
     * 拒绝通话
     * @param isBusy
     */
    private rejectCall;
    private initEventListener;
    private signalRoomJoinHandler;
    private roomCloseHandler;
    private signalLeaveHandler;
    private acceptHandler;
    private inviteHandler;
    private cancelInviteHandler;
    private rejectHandler;
    /**
     * 批量标记消息已读
     * @param events
     */
    private batchMarkEvent;
    /**
     * 更新通话中的用户数
     * @param members
     */
    private filterCallingUserByMembers;
    private clearTimer;
}
export default SignalController;
