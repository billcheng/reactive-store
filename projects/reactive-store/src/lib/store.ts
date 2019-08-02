import { Observable, BehaviorSubject } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { addReducer, dispatchAction, Action } from './core';
import { addSideEffect, SideEffectFunc, SideEffects, Predicate } from './effects-core';
import { dispatchStoreEvent } from './core-hook';

export class Store<T extends Object> {

    private __rx_store_initial_state__: any;
    private __rx_store_methods__: { method: (state: any, payload: any) => any, type: string }[];
    private __rx_store_side_effects__: SideEffects;

    private state$: BehaviorSubject<T>;
    private reducerMap: Map<string, Function>;

    constructor() {
        const initialState = this.__rx_store_initial_state__;
        if (typeof initialState !== 'object')
            throw new Error('No initial state found');

        this.state$ = new BehaviorSubject(initialState);
        dispatchStoreEvent("INITIAL-STATE", { state: initialState });

        if (this.__rx_store_methods__) {
            this.reducerMap = new Map(this.__rx_store_methods__.map(({ type, method }) => ([type, method.bind(this)])));
            addReducer(this.processReducer.bind(this));
        }

        if (this.__rx_store_side_effects__) {
            this.addSideEffects(this.__rx_store_side_effects__);
        }
    }

    private processReducer(action: Action<any>) {
        const reducer = this.reducerMap.get(action.type);
        if (reducer) {
            const current = this.state$.value;
            const future = reducer(current, action.payload);
            if (future !== current)
                this.state$.next(future);
        }
    }

    protected addSideEffect(actionType: string, sideEffect: SideEffectFunc<T>) {
        dispatchStoreEvent("ADD-SIDE-EFFECT", { actionType, sideEffect });
        addSideEffect(actionType, sideEffect.bind(this));
    }

    protected addSideEffects(sideEffects: SideEffects) {
        Object.entries(sideEffects).forEach(([actionType, sideEffect]) => this.addSideEffect(actionType, sideEffect));
    }

    public select<P>(predicate: Predicate<T, P>): Observable<P> {
        return this.state$
            .pipe(
                map(predicate),
                distinctUntilChanged()
            );
    }

    public map<P>(predicate: Predicate<T, P>): Observable<P> {
        return this.state$
            .pipe(
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
        return this.state$.value;
    }
}