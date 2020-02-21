import { Action, queue_extension, dispatchAction } from "./core";

export type SideEffectFunc<T> = (action: Action<T>) => Action<any> | void;
export const sideEffects = new Map<string, SideEffectFunc<any>[]>();

export interface SideEffects {
  [key: string]: SideEffectFunc<any>;
}

export type Predicate<T, P> = (p: T) => P;

queue_extension.subscribe(async action => {
  if (sideEffects.has(action.type)) {
    const currentActions = sideEffects.get(action.type) || [];
    for (const currentAction of currentActions) {
      const nextAction = await currentAction(action.payload);
      if (nextAction) {
        dispatchAction(nextAction);
      }
    }
  }
});

export function addSideEffect<T>(
  actionType: string,
  sideEffect: SideEffectFunc<T>
) {
  sideEffects.set(actionType, [
    ...(sideEffects.get(actionType) || []),
    sideEffect
  ]);
}

export function removeSideEffect<T>(
  actionType: string,
  sideEffect: SideEffectFunc<T>
) {
  const current = sideEffects.get(actionType) || [];
  const idx = current.findIndex(p => p === sideEffect);
  const newArray = [...current.slice(0, idx), ...current.slice(idx + 1)];
  if (newArray.length === 0) {
    return sideEffects.delete(actionType);
  }

  return sideEffects.set(actionType, newArray);
}

export function clearSideEffects() {
    sideEffects.clear();
}