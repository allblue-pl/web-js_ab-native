'use strict';

const
    js0 = require('js0'),

    abNative = require('.')
;

export default class NativeApp
{

    constructor() {
        
    }

    callNative(actionId, actionsSetName, actionInfo, args = null) {
        js0.args(arguments, 'int', 'string', js0.RawObject, [ js0.RawObject, 
                js0.Null, js0.Default ]);

        let errors = [];
        if (actionInfo.actionArgs === null) {
            if (args !== null) {
                console.error('Action takes no arguments.');
                throw new Error(`Wrong action '${actionsSetName}:${actionInfo.name}' args.`);
            }
        } else {
            if (args === null) {
                console.error('Action takes arguments, none given.');
                throw new Error(`Wrong action '${actionsSetName}:${actionInfo.name}' args.`);
            }

            if (!js0.type(args, js0.Preset(actionInfo.actionArgs), errors)) {
                console.error(errors);
                throw new Error(`Wrong action '${actionsSetName}:${actionInfo.name}' args.`);
            }
        }
        
        this.__callNative(actionId, actionsSetName, actionInfo.name, args);
    }

    callWeb(actionId, actionsSetName, actionName, actionArgs = null) {
        js0.args(arguments, 'int', 'string', 'string', [ js0.RawObject,
                js0.Null ]);

        let actionInfo = null;
        try {
            actionInfo = abNative.getActionsSet(actionsSetName)
                    .getWebInfo(actionName);
        } catch (err) {
            console.error(err);
            this.__onWebResult(actionId, null, err.toString());
            return;
        }

        if (actionInfo.actionArgs === null) {
            if (actionArgs !== null) {
                let errorMessage = `Wrong action '${actionsSetName}:${actionInfo.name}' args:` +
                        ' Action takes no arguments some given.';
                console.error(errorMessage);
                this.__onWebResult(actionId, null, errorMessage);
                return;
            }
        } else {
            let errors = [];
            if (!js0.type(actionArgs, js0.Preset(actionInfo.actionArgs), errors)) {
                let errorMessage = `Wrong action '${actionsSetName}:${actionInfo.name}'` +
                        ' args:';
                console.error(errorMessage, errors);
                this.__onWebResult(actionId, null, errorMessage +  '\r\n' +
                        errors.join('\r\n'));
                return;
            }
        }

        let fnResult = actionInfo.fn(actionArgs);
        if (js0.type(fnResult, Promise)) {
            fnResult
                .then((result) => {
                    this._callWeb_ParseResult(actionId, actionInfo, result);
                })
                .catch((err) => {
                    console.error(err);
                    this.__onWebResult(actionId, null, err.toString());
                });
        } else {
            try {
                this._callWeb_ParseResult(actionId, actionInfo, fnResult);
            } catch (err) {
                console.error(err);
                this.__onWebResult(actionId, null, err.toString());
                return;
            }
        }

        // this.__onWebResult(actionId, result);
    }

    init() {
        this.__init();
    }

    
    _callWeb_ParseResult(actionId, actionInfo, result) {
        let errors = [];
        if (actionInfo.resultArgs === null) {
            if (!js0.type(result, [ js0.Null, 'undefined' ]))
                throw new Error(`Wrong action '${actionInfo.name}' result. Expected: none.`);
            result = null;
        } else if (!js0.type(result, js0.Preset(actionInfo.resultArgs), errors)) {
            console.error(errors);
            throw new Error(`Wrong action '${actionInfo.name}' result. Expected: ` + 
                    actionInfo.resultArgs);
        }

        this.__onWebResult(actionId, result, null);
    }

    _getNextActionId() {
        return ++this.actionId_Last;
    }


    __callNative(actionId, actionsSetName, actionName, actionArgs) {
        js0.args(arguments, 'string', 'string', [ js0.RawObject, js0.Null ]);
        js0.virtual(this);
    }

    __init() {
        js0.virtual(this);
    }

    __onWebResult(actionId, result, error) {
        js0.args(arguments, 'int', [ js0.RawObject, js0.Null ], 
                [ 'string', js0.Null ]);
        js0.virtual(this);
    }

}