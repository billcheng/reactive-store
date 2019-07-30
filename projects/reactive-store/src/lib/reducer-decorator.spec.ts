import { Reducer } from './reducer-decorator';
import { createAction } from './createAction';

describe('reducer-decorator', () => {

    let target;
    const method = () => { };

    beforeEach(() => {
        target = () => { };
        target.prototype = {};
    });

    it('should register the reducer the very first time', () => {
        const actionFn = createAction('action1');

        Reducer(actionFn)(target.prototype, '', { value: method });

        expect(target.prototype.__rx_store_methods__).toEqual([
            { type: 'action1', method }
        ]);
    });

    it('should register the reducer to an existing method', () => {
        const actionFn = createAction('action1');
        Reducer(actionFn)(target.prototype, '', { value: method });

        Reducer(actionFn)(target.prototype, '', { value: method });

        expect(target.prototype.__rx_store_methods__).toEqual([
            { type: 'action1', method },
            { type: 'action1', method }
        ]);
    });
});