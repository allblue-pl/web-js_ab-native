'use strict';

const
    js0 = require('js0'),

    abNative = require('.')
;

export default class ActionsSetDef
{

    constructor()
    {
        js0.args(arguments);

        this._actions_Native = {};
        this._actions_Web = {};
    }

    addNative(actionName, actionArgs, resultArgs)
    {
        js0.args(arguments, 'string', js0.RawObject, js0.RawObject);

        this._actions_Native[actionName] = {
            name: actionName,
            actionArgs: actionArgs,
            resultArgs: resultArgs,
        };

        return this;
    }

    addWeb(actionName, actionArgs, resultArgs, fn)
    {
        js0.args(arguments, 'string', js0.RawObject, js0.RawObject, 'function');

        this._actions_Web[actionName] = {
            name: actionName,
            actionArgs: actionArgs,
            resultArgs: resultArgs,
            fn: fn,  
        };

        return this;
    }

    callNative(actionsSetName, actionName, actionArgs = {}, callbackFn = null)
    {
        abNative.callNative(actionsSetName, actionName, actionArgs, callbackFn);
    }

    callNative_Async(actionName, actionArgs = {})
    {
        return new Promise((resolve, reject) => {
            try {
                this.callNative(actionName, actionArgs, (result) => {
                    resolve(result);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    getNativeInfo(actionName)
    {
        if (!(actionName in this._actions_Native))
            throw new Error(`Action '${actionName}' does not exist in Actions Set '${this.name}'.`);

        return this._actions_Native[actionName];
    }

    getWebInfo(actionName)
    {
        if (!(actionName in this._actions_Web))
            throw new Error(`Action '${actionName}' does not exist in Actions Set '${this.name}'.`);

        return this._actions_Web[actionName];
    }

    // init()
    // {
    //     abNative.init(this);
    // }

}