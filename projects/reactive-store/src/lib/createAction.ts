import { Action } from './core';

export type CreatedAction<T> = (payload: T) => Action<T>;

export function createAction<T>(type: string): CreatedAction<T> {
    return (payload: T): Action<T> => {
        return {
            type,
            payload
        };
    };
}
