'use strict';

const
    js0 = require('js0'),

    abNative = require('.')
;

export default class NativeActionsSet
{

    constructor(name, actionsSet) {
        js0.args(arguments, 'string', require('./ActionsSetDef'));

        this.name = name;
        this.actionsSet = actionsSet;
    }

    async callNative_Async(actionName, actionArgs = null) {
        return await abNative.callNative_Async(this.name, actionName, actionArgs);
    }

}