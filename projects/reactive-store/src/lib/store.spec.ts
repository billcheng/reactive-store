import { states$, clear, setStorageStrategy, StorageStrategy, reducers } from './core';
import { InitialState } from './initial-state-decorator';
import { Store } from './store';
import { createAction } from './createAction';
import { Reducer } from './reducer-decorator';
import { Effect } from './effect-decorator';
import { sideEffects } from './effects-core';

const actionFn = createAction('action1');

@InitialState({
    busy: true
})
class Test extends Store<any> {

    @Reducer(actionFn)
    action1Reducer(state: any) {
        return state;
    }

    @Effect(actionFn)
    effect1() {
    }

};

describe('Store', () => {

    let test: Test;

    beforeEach(() => {
        clear();
        sideEffects.clear();
        test = new Test();
    });

    it('should set the initial state as the @InitialState', () => {
        expect(states$.value).toEqual({ Test: { busy: true } });
    });

    it('should add a reducer', () => {
        expect([...reducers.keys()]).toEqual(['Test']);
    });

    it('should add an effect', () => {
        expect([...sideEffects.keys()]).toEqual(['action1']);
    });
});