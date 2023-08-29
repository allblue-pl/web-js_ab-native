'use strict';

const
    js0 = require('js0'),

    NativeApp = require('./NativeApp')
;

export default class NativeApp_Android extends NativeApp
{

    constructor()
    {
        super();
    }


    /* NativeApp */
    __callNative(actionId, actionsSetName, actionName, args)
    {
        js0.args(arguments, 'int', 'string', 'string', [ js0.RawObject, 
                js0.Null ] );
        
        if (typeof abNative_Android === 'undefined')
            throw new Error('Native module not initialized.');

        abNative_Android.callNative(actionId, actionsSetName, actionName, 
                args === null ? null : JSON.stringify(args));
    }

    __init()
    {
        if (typeof abNative_Android === 'undefined')
            throw new Error('Native module not initialized.');

        abNative_Android.webViewInitialized();
    }

    __onWebResult(actionId, result)
    {
        js0.args(arguments, 'int', [ js0.RawObject, js0.Null ]);

        if (typeof abNative_Android === 'undefined')
            throw new Error('Native module not initialized.');

        abNative_Android.onWebResult(actionId, result === null ? 
                null : JSON.stringify(result));
    }
    /* / NativeApp */

}