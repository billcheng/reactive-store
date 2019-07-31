import { Subject, BehaviorSubject } from 'rxjs';
import { dispatchStoreEvent } from './core-hook';

export interface Action<T> {
    type: string;
    payload: T;
}

export type ReducerFunc<R, T> = (state: any, action: Action<T>) => R;

const queue = new Subject<Action<any>>();
export const reducers = new Map<string, ReducerFunc<any, any>>();
export const states$ = new BehaviorSubject<any>({});
export const queue_extension = new Subject<Action<any>>();
export enum StorageStrategy {
    Memory,
    LocalStorage
}
let storageStrategy: StorageStrategy = StorageStrategy.Memory;
const StorageName = '__RX_STORE_STATE__';

queue.subscribe(action => {
    let futureStates = states$.value;
    reducers.forEach((reducerFunc, key) => {
        const currentState = states$.value[key] || {};
        const futureState = reducerFunc(currentState, action) || currentState;
        if (currentState !== futureState) {
            futureStates = { ...futureStates, [key]: futureState };
        }
    });

    if (futureStates !== states$.value) {
        states$.next(futureStates);
        if (storageStrategy===StorageStrategy.LocalStorage)
            window.localStorage.setItem(StorageName, JSON.stringify(futureStates));
    }

    queue_extension.next(action);
});

export function addReducer<R, T>(key: string, reducer: ReducerFunc<R, T>, replaceKey = false) {
    if (replaceKey && reducers.has(key))
        throw new Error(`${key} already exists in reducers`);

    reducers.set(key, reducer);
}

export function removeReducer(key: string) {
    return reducers.delete(key);
}

export function initialState<R>(key: string, state: R) {
    if (states$.value[key])
        console.warn(`${key} already exists in current state`, state);
    if (storageStrategy !== StorageStrategy.LocalStorage || !states$.value[key]) {
        states$.next({ ...states$.value, [key]: state });
    }
}

export function dispatchAction<T>(action: Action<T>) {
    dispatchStoreEvent("DISPATCH-ACTION", action);

    queue.next(action);
}

export function setStorageStrategy(strategy: StorageStrategy) {
    storageStrategy = strategy;
    if (strategy===StorageStrategy.LocalStorage) {
        const obj = JSON.parse(window.localStorage.getItem(StorageName) || '{}');
        states$.next(obj);
    }
}

export function clear() {
    reducers.clear();
    states$.next({});
}