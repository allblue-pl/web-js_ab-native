'use strict';

const
    js0 = require('js0'),

    NativeApp = require('./NativeApp')
;

export default class NativeApp_IOS extends NativeApp
{

    constructor() {
        super();
    }


    /* NativeApp */
    __callNative(actionId, actionsSetName, actionName, actionArgs) {
        js0.args(arguments, 'int', 'string', 'string', 
                [ js0.RawObject, js0.Null] );
        
        window.webkit.messageHandlers.abNative_IOS.postMessage({
            messageType: 'callNative',
            actionId: actionId, 
            actionsSetName: actionsSetName, 
            actionName: actionName, 
            actionArgs: actionArgs,
        });
    }

    __init() {
        if (typeof window.webkit === 'undefined')
            throw new Error('Native module not initialized.');
        if (typeof window.webkit.messageHandlers === 'undefined')
            throw new Error('Native module not initialized.');
        if (typeof window.webkit.messageHandlers.abNative_IOS === 'undefined')
            throw new Error('Native module not initialized.');

        window.webkit.messageHandlers.abNative_IOS.postMessage({
            messageType: 'webViewInitialized'
        });
    }

    __onWebResult(actionId, result, error) {
        js0.args(arguments, 'int', [ js0.RawObject, js0.Null ], 
                [ 'string', js0.Null ]);

        window.webkit.messageHandlers.abNative_IOS.postMessage({
            messageType: 'onWebResult',
            actionId: actionId,
            result: result,
            error: error,
        });
    }
    /* / NativeApp */

}