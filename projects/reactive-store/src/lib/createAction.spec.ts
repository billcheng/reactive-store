import { createAction } from './createAction';

describe('createAction', () => {

    it('should create an action function', () => {
        const actionFn = createAction('type');

        expect(actionFn('hello')).toEqual({
            type: 'type',
            payload: 'hello'
        });
    });

});