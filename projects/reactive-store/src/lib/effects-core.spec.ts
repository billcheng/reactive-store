import { addSideEffect, sideEffects, removeSideEffect } from './effects-core';
import { queue_extension, clear } from './core';
import { fakeAsync, tick } from '@angular/core/testing';

describe('effects-core', () => {
    beforeEach(() => {
        clear();
        sideEffects.clear();
    });

    describe('addSideEffect', () => {

        it('should add to an empty action type', () => {
            const action = () => { };

            addSideEffect('abc', action);

            expect([...sideEffects.entries()]).toEqual([
                ['abc', [action]]
            ]);
        });

        it('should add to an existing action type', () => {
            const action = () => { };

            addSideEffect('abc', action);
            addSideEffect('abc', action);

            expect([...sideEffects.entries()]).toEqual([
                ['abc', [action, action]]
            ]);
        });
    });

    describe('removeSideEffect', () => {
        it('should remove an existing side effect', () => {
            const action = () => { };
            addSideEffect('abc', action);

            removeSideEffect('abc', action);

            expect(sideEffects.size).toEqual(0);
        });

        it('should remove an existing side effect given the action has multiple side effects', () => {
            const action = () => { };
            addSideEffect('abc', action);
            addSideEffect('abc', action);

            removeSideEffect('abc', action);

            expect([...sideEffects.entries()]).toEqual([
                ['abc',[action]]
            ]);
        });
    });

    describe('queue_extension', () => {
        it('should invoke a side effect when dispatching the action', () => {
            const action = jasmine.createSpy();
            addSideEffect('abc', action);

            queue_extension.next({ type: 'abc', payload: true });

            expect(action).toHaveBeenCalledWith(true);
        });

        it('should dispatch next action returned by current action when invoked', fakeAsync(() => {
            const action = () => ({ type: 'bcd', payload: false });
            addSideEffect('abc', action);
            const queue = [];
            const sub = queue_extension.subscribe(p => queue.push(p));

            queue_extension.next({ type: 'abc', payload: true });

            tick(1000);

            expect(queue).toEqual([
                { type: 'abc', payload: true },
                { type: 'bcd', payload: false }
            ]);
            sub.unsubscribe();
        }));

    });
});