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
        js0.args(arguments, 'int', 'string', 'string', js0.RawObject);
        
        abNative_Android.callNative(actionId, actionsSetName, actionName, 
                JSON.stringify(args));
    }

    __onWebResult(actionId, result)
    {
        js0.args(arguments, 'int', [ js0.RawObject, js0.Null ]);

        abNative_Android.onWebResult(actionId, JSON.stringify(result));
    }
    /* / NativeApp */

}