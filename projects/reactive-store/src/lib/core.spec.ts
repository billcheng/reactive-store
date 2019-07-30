import { addReducer, dispatchAction, initialState, clear } from './core';

describe('core', () => {

    beforeEach(() => {
        clear();
    })

    it('should call reducer with current state and dispatched action when dispatching an action', () => {
        const reducer = jasmine.createSpy();
        initialState('key1', { busy: false });
        addReducer('key1', reducer);

        dispatchAction({ type: 'ABC', payload: 'BCD' });

        expect(reducer).toHaveBeenCalledWith({busy: false}, { type: 'ABC', payload: 'BCD' });
    });

});