import { Effect } from './effect-decorator';
import { createAction } from './createAction';

describe('effect-decorator', () => {

    it('should add effect to the store', () => {
        const func = () => { };
        const actionFn = createAction('abc');
        const target = {};

        Effect(actionFn)(target, 'propertyKey', { value: func });

        expect(target['__rx_store_side_effects__']).toEqual({
            abc: func
        });
    });

});