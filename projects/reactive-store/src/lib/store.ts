import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { addReducer, states$, dispatchAction, Action, ReducerFunc } from './core';
import { addSideEffect, SideEffectFunc, SideEffects, Predicate } from './effects-core';
import { dispatchStoreEvent } from './core-hook';
import { initialState as setInitialState } from './core';

export class Store<T extends Object> {

    private __rx_store_key__: string;
    private __rx_store_initial_state__: any;
    private __rx_store_methods__: { method: (state: any, payload: any) => any, type: string }[];
    private __rx_store_side_effects__: SideEffects;

    constructor() {
        const initialState = this.__rx_store_initial_state__;
        if (typeof initialState !== 'object')
            throw new Error('No initial state found');

        setInitialState(this.__rx_store_key__, initialState);
        dispatchStoreEvent("INITIAL-STATE", { state: initialState });

        if (this.__rx_store_methods__) {
            const map = new Map(this.__rx_store_methods__.map(({ type, method }) => ([type, method.bind(this)])));
            this.addReducer((state, action: Action<any>) => {
                const method = map.get(action.type);
                if (method) {
                    return method(state, action.payload);
                }
            });
        }

        if (this.__rx_store_side_effects__) {
            this.addSideEffects(this.__rx_store_side_effects__);
        }
    }

    protected addReducer<R>(reducer: ReducerFunc<T, R>) {
        dispatchStoreEvent("ADD-REDUCER", reducer);
        addReducer(this.__rx_store_key__, reducer.bind(this));
    }

    protected addSideEffect(actionType: string, sideEffect: SideEffectFunc<T>) {
        dispatchStoreEvent("ADD-SIDE-EFFECT", { actionType, sideEffect });
        addSideEffect(actionType, sideEffect.bind(this));
    }

    protected addSideEffects(sideEffects: SideEffects) {
        Object.entries(sideEffects).forEach(([actionType, sideEffect]) => this.addSideEffect(actionType, sideEffect));
    }

    public select<P>(predicate: Predicate<T, P>): Observable<P> {
        return states$
            .pipe(
                map(p => p[this.__rx_store_key__]),
                map(predicate),
                distinctUntilChanged()
            );
    }

    public map<P>(predicate: Predicate<T, P>): Observable<P> {
        return states$
            .pipe(
                map(p => p[this.__rx_store_key__]),
                map(predicate)
            );
    }

    protected immutableReplaceElement<X>(array: X[], newElement: X, index: number): X[] {
        return [...array.slice(0, index), newElement, ...array.slice(index + 1)];
    }

    protected immutableRemoveElement<X>(array: X[], index: number): X[] {
        return [...array.slice(0, index), ...array.slice(index + 1)];
    }

    protected immutableInsertElement<X>(array: X[], element: X, index: number): X[] {
        return [...array.slice(0, index), element, ...array.slice(index)];
    }

    protected immutablePrependElement<X>(array: X[], element: X): X[] {
        return [element, ...array];
    }

    protected immutableAppendElement<X>(array: X[], element: X): X[] {
        return [...array, element];
    }

    public dispatch<R>(action: Action<R>) {
        dispatchAction(action);
    }

    public get state(): T {
        return states$.value[this.__rx_store_key__] || {};
    }

    protected get states(): any {
        return states$.value || {};
    }
}