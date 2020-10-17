'use strict';

const
    js0 = require('js0'),

    abNative = require('.')
;

export default class NativeActionsSet
{

    constructor(name, actionsSet)
    {
        js0.args(arguments, 'string', require('./ActionsSetDef'));

        this.name = name;
        this.actionsSet = actionsSet;
    }

    callNative(actionName, actionArgs = {}, callbackFn = null)
    {
        abNative.callNative(this.name, actionName, actionArgs, callbackFn);
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

}