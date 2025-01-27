'use strict';

const
    js0 = require('js0')
;

class abNative_Class
{

    get ActionsSetDef() {
        return require('./ActionsSetDef');
    }

    get WebApp() {
        return require('./WebApp');
    }


    constructor() {
        this.nativeApp = null;

        this._actionsSets = {};
        this._initialized = false;

        this._actionId_Next = 0;
        this._onResultInfos = {};
    }

    addActionsSet(actionsSetName, actionsSet) {
        const 
            NativeActionsSet = require('./NativeActionsSet')
        ;

        js0.args(arguments, 'string', require('./ActionsSetDef'));

        if (this._initialized)
            throw new Error('Cannot add action set after initialization.');

        let nativeActionsSet = new NativeActionsSet(actionsSetName, actionsSet);

        this._actionsSets[actionsSetName] = actionsSet;

        return nativeActionsSet;
    }

    // createActionsSet(actionsSetName)
    // {
    //     js0.args(arguments, 'string');

    //     return new NativeActionsSet(name);
    // }

    callNative_Async(actionsSetName, actionName, args = null) {
        js0.args(arguments, 'string', 'string', [ js0.RawObject, js0.Default ], 
                [ 'function', js0.Null, js0.Default ]);

        if (!this._initialized)
            throw new Error(`'abNative' has not been initialized.`);
        return new Promise((resolve, reject) => {
            try {
                this._callNative(actionsSetName, actionName, args, (result) => {
                    resolve(result);
                }, (err) => {
                    reject(err);
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    callWeb(actionId, actionsSetName, actionName, actionArgs) {
        js0.args(arguments, 'int', 'string', 'string', 
                [ js0.RawObject, js0.Null ]);

        if (this.nativeApp === null)
            throw new Error('Platform not set.');

        if (!this._initialized)
            throw new Error(`'abNative' has not been initialized.`);

        this.nativeApp.callWeb(actionId, actionsSetName, actionName, 
                actionArgs);
    }

    errorNative(message) {
        console.error('Native error:', message);
    }

    // getActionInfo(actionsSetName, actionName) {
    //     if (!(actionName in nativeActions.actions_Web))
    //         throw new Error(`Action '${actionsSetName}:${actionName}' does not exist.`);
    // }

    getActionsSet(actionsSetName) {
        if (!(actionsSetName in this._actionsSets))
            throw new Error(`Actions Set '${actionsSetName}' does not exist.`);

        return this._actionsSets[actionsSetName];
    }

    init(platform) {
        js0.args(arguments, js0.Enum([ 'web', 'android', 'ios' ]));

        if (this._initialized)
            throw new Error(`'abNative' was already initialized.`);
        this._initialized = true;

        if (platform === 'web')
            this.nativeApp = new (require('./NativeApp_Web'))();
        else if (platform === 'android')
            this.nativeApp = new (require('./NativeApp_Android'))();
        else if (platform === 'ios')
            this.nativeApp = new (require('./NativeApp_IOS'))();

        this.nativeApp.init();
    }

    onNativeResult(actionId, result, error) {
        if (!(actionId in this._onResultInfos))
            throw new Error(`Action '${actionId}' does not exist.`);

        let actionInfo = this._onResultInfos[actionId].actionInfo;

        if (error !== null)
            this._onResultInfos[actionId].onErrorFn(error);
        else { 
            if (actionInfo.resultArgs !== null) {
                let errors = [];
                if (!js0.type(result, js0.Preset(actionInfo.resultArgs), errors)) {
                    console.error('Result:', result);
                    console.error(errors);
                    this._onResultInfos[actionId].onErrorFn(
                            `Wrong action '${actionInfo.name}' result.`);
                    delete this._onResultInfos[actionId];
                    return;
                }
            }

            this._onResultInfos[actionId].onResultFn(result);
        }

        delete this._onResultInfos[actionId];

        // let parseResultFn = (result) => {
        //     console.log(actionInfo, result);
        //     if (actionInfo.resultArgs !== null) {
        //         let errors = [];
        //         if (!js0.type(result, js0.Preset(actionInfo.resultArgs), errors)) {
        //             console.error('Result:', result);
        //             console.error(errors);
        //             throw new Error(`Wrong action '${actionInfo.name}' result.`);
        //         }
        //     }
    
        //     if (this._onResultInfos[actionId].callbackFn !== null)
        //         this._onResultInfos[actionId].callbackFn(result);
        //     delete this._onResultInfos[actionId];
        // };

        // if (result instanceof Promise) {
        //     result
        //         .then((result) => {
        //             parseResultFn(result);
        //         })
        //         .catch((e) => {
        //             console.error('Cannot parse native result promise:');
        //             console.error(e);
        //         });
        // } else 
        //     parseResultFn(result);
    }

    // setPlatform(platform)
    // {
    //     js0.args(arguments, js0.Enum([ 'web', 'android', 'ios' ]));

    //     console.log('Platform set: ' + platform);

    //     this.init(platform);
    // }


    _callNative(actionsSetName, actionName, actionArgs, onResultFn, onErrorFn) {
        js0.args(arguments, 'string', 'string', [ js0.RawObject, 
                js0.Null ], 'function', 'function');

        if (this.nativeApp === null)
            throw new Error('Platform not set.');

        if (!this._initialized)
            throw new Error(`'abNative' has not been initialized.`);

        if (!this.getActionsSet(actionsSetName).hasNative(actionName)) {
            throw new Error(`Action '${actionName}' does not exist in Actions Set '${actionsSetName}'.`);
        }
        let actionInfo = this.getActionsSet(actionsSetName)
                .getNativeInfo(actionName);

        let actionId = this._actionId_Next;
        this._actionId_Next++;

        this._onResultInfos[actionId] = {
            actionInfo: actionInfo,
            onResultFn: onResultFn,
            onErrorFn: onErrorFn,
        };

        this.nativeApp.callNative(actionId, actionsSetName, actionInfo, 
                actionArgs);
    }

}
export default abNative = new abNative_Class();