'use strict';

const
    js0 = require('js0'),

    NativeApp = require('./NativeApp')
;

export default class NativeApp_Web extends NativeApp 
{

    constructor()
    {
        super();
    }

    
    /* NativeApp */
    __callNative(actionId, actionsSetName, actionName, args)
    {
        js0.args(arguments, 'int', 'string', 'string', js0.RawObject);
        abNative_WebApp.callNative(actionId, actionsSetName, actionName, args);
    }

    // __onWebResult(actionId, result)
    // {
    //     abNative_WebApp.onWebResult(actionId, result);
    // }
    /* / NativeApp */
}