'use strict';

const
    js0 = require('js0'),

    ActionsSet = require('./WebApp.ActionsSet'),
    NativeActionsSet = require('./WebApp.NativeActionsSet')
;

export default class WebApp
{

    static get ActionsSet() {
        return ActionsSet;
    }


    constructor()
    {
        this._actionsSets = {};
        this._onResultListeners = {};

        this._actionId_Last = 0;
    }

    addActionsSet(actionsSetName, actionsSet)
    {
        js0.args(arguments, 'string', require('./WebApp.ActionsSet'));

        this._actionsSets[actionsSetName] = actionsSet;

        return new NativeActionsSet(actionsSetName, actionsSet);
    }

    callNative(actionId, actionsSetName, actionName, args, callbackFn)
    {
        let actionsSet = this.getActionsSet(actionsSetName);
        let actionInfo = actionsSet.getNativeInfo(actionName);

        let result = actionInfo.fn(args);
        abNative.onNativeResult(actionId, result);
    }

    callWeb(actionsSetsName, actionName, args, callbackFn = null)
    {   
        let actionId = ++this._actionId_Last;
        this._onResultListeners[actionId] = callbackFn;
        abNative.callWeb(actionId, actionsSetsName, actionName, args);
    }

    createActionsSet(actionsSetName)
    {
        return new ActionsSet(this, actionsSetName);
    }

    getActionsSet(actionsSetName)
    {
        if (!(actionsSetName in this._actionsSets))
            throw new Error(`Actions Set '${actionsSetName}' does not exist.`);

        return this._actionsSets[actionsSetName];
    }

    onWebResult(actionId, result)
    {
        this._onResultListeners[actionId](result);
        delete this._onResultListeners[actionId];
    }

}