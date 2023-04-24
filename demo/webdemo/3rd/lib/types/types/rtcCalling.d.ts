import { SignallingCommon, RTCCommon, RoomInfo, EventCode, CallType } from './common';
export interface RTCCalling extends SignallingCommon, RTCCommon {
    getSdkInstance(): any;
    getRoomInfo(): Promise<RoomInfo>;
    addDelegate(eventCode: EventCode, callback: (...args: any) => void): void;
    removeDelegate(eventCode: EventCode): void;
    switchCallType(type: CallType): Promise<void>;
}
