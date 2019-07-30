/*
 * Public API Surface of reactive-store
 */

export { StorageStrategy, addReducer, dispatchAction, removeReducer, setStorageStrategy } from './lib/core';
export { HookCallBack, enableConsoleLog } from './lib/core-hook';
export { createAction, CreatedAction } from './lib/createAction';
export { Effect } from './lib/effect-decorator';
export { addSideEffect, removeSideEffect } from './lib/effects-core';
export { InitialState } from './lib/initial-state-decorator';
export { Reducer } from './lib/reducer-decorator';
export { Store } from './lib/store';