import { InitialState } from './initial-state-decorator';

describe('initial-state-decorator', () => {
    it('should set the initial state value', () => {
        const target = () => { };
        target.prototype = {};

        InitialState({ test: true })(target);

        expect(target.prototype.__rx_store_initial_state__).toEqual({ test: true });
    });

    xit('should store class name as the key', () => {
        const target = () => { };
        target.prototype = {};

        InitialState({ test: true })(target);

        expect(target.prototype.__rx_store_key__).toEqual('target');
    });
});