import { Subject } from 'rxjs';
import { dispatchStoreEvent } from './core-hook';

export interface Action<T> {
    type: string;
    payload: T;
}

export type ReducerFunc<R, T> = (action: Action<T>) => R;

const queue = new Subject<Action<any>>();
export let reducers = [];
export const queue_extension = new Subject<Action<any>>();

queue.subscribe(action => {
    reducers.forEach(reducerFunc => reducerFunc(action));
    queue_extension.next(action);
});

export function addReducer<R, T>(reducer: ReducerFunc<R, T>) {
    reducers.push(reducer);
}

export function dispatchAction<T>(action: Action<T>) {
    dispatchStoreEvent("DISPATCH-ACTION", action);

    queue.next(action);
}
