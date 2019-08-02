import { reducers } from './core';
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
        sideEffects.clear();
        test = new Test();
    });

    it('should set the initial state as the @InitialState', () => {
        expect(test.state).toEqual({ busy: true });
    });

    it('should add a reducer', () => {
        expect([...(test as any).reducerMap.keys()]).toEqual(['action1']);
    });

    it('should add an effect', () => {
        expect([...sideEffects.keys()]).toEqual(['action1']);
    });
});