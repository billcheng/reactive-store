import { enableConsoleLog } from './core-hook';

describe('core-hook', () => {

    afterEach(() => {
        window.__A4_STORE_HOOK__ = null;
    });

    it('should add consoleLog hook', () => {
        enableConsoleLog();

        expect(window['__A4_STORE_HOOK__']).not.toBeUndefined();
    });

    describe('enableConsoleLog', () => {

        it('should call the previous hook function', () => {
            const original = () => { };
            const test = jasmine.createSpy('test', original).and.callThrough();
            window['__A4_STORE_HOOK__'] = test;
            enableConsoleLog();

            window['__A4_STORE_HOOK__']("DISPATCH-ACTION", {type: 'action.type'});

            expect(test).toHaveBeenCalled();
        });
    });

});