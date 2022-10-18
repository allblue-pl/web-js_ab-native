'use strict';

const
    js0 = require('js0')
;

export default class NativeApp
{

    constructor()
    {
        
    }

    callNative(actionId, actionsSetName, actionInfo, args = null)
    {
        js0.args(arguments, 'int', 'string', js0.RawObject, js0.RawObject, 
                [ 'function', js0.Null, js0.Default ]);

        let errors = [];
        if (actionInfo.actionArgs === null) {
            if (args !== null) {
                console.error('Action takes no arguments.');
                throw new Error(`Wrong action '${actionsSetsName}:${actionInfo.name}' args.`);
            }
        } else {
            if (!js0.type(args, js0.Preset(actionInfo.actionArgs), errors)) {
                console.error(errors);
                throw new Error(`Wrong action '${actionInfo.name}' args.`);
            }
        }
        
        this.__callNative(actionId, actionsSetName, actionInfo.name, args);
    }

    callWeb(actionId, actionsSetsName, actionInfo, args = null)
    {
        js0.args(arguments, 'int', 'string', js0.RawObject, [ js0.RawObject,
                js0.Null ]);

        let errors = [];
        if (actionInfo.actionArgs === null) {
            if (args !== null) {
                console.error('Action takes no arguments.');
                throw new Error(`Wrong action '${actionsSetsName}:${actionInfo.name}' args.`);
            }
        } else {
            if (!js0.type(args, js0.Preset(actionInfo.actionArgs), errors)) {
                console.error(errors);
                throw new Error(`Wrong action '${actionsSetsName}:${actionInfo.name}' args.`);
            }
        }

        let fnResult = actionInfo.fn(args);
        if (js0.type(fnResult, Promise)) {
            fnResult
                .then((result) => {
                    this._callWeb_ParseResult(actionId, actionInfo, result);
                })
                .catch((err) => {
                    throw err;
                });
        } else {
            this._callWeb_ParseResult(actionId, actionInfo, fnResult);
        }

        // this.__onWebResult(actionId, result);
    }

    init()
    {
        this.__init();
    }

    
    _callWeb_ParseResult(actionId, actionInfo, result)
    {
        let errors = [];
        if (actionInfo.resultArgs === null) {
            if (!js0.type(result, 'undefined'))
                throw new Error(`Wrong action '${actionInfo.name}' result. Expected: none.`);
            result = null;
        } else if (!js0.type(result, js0.Preset(actionInfo.resultArgs), errors)) {
            console.error(errors);
            throw new Error(`Wrong action '${actionInfo.name}' result. Expected: ` + 
                    actionInfo.resultArgs);
        }

        this.__onWebResult(actionId, result);
    }

    _getNextActionId()
    {
        return ++this.actionId_Last;
    }


    __callNative(actionsSetName, actionName, args, callbackFn = null)
    {
        js0.args(arguments, 'string', 'string', [ js0.RawObject, js0.Null ], 
                'function');
        js0.virtual(this);
    }

    __init()
    {
        js0.virtual(this);
    }

    __onWebResult()
    {
        js0.virtual(this);
    }

}