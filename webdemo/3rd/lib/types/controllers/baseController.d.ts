import { BaseOptions } from '../types/common';
import EventEmitter from 'eventemitter3';
declare class BaseController extends EventEmitter {
    log: any;
    debug: boolean;
    constructor({ debug }: BaseOptions);
}
export default BaseController;
