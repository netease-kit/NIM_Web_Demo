import { BaseOptions } from '../types';
import EventEmitter from 'eventemitter3';
declare class BaseController extends EventEmitter {
    log: any;
    debug: boolean;
    constructor({ debug }: BaseOptions);
}
export default BaseController;
