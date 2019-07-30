import { CreatedAction } from './createAction';

export function Effect<T>(createdAction: CreatedAction<T>): MethodDecorator {
    const action = createdAction(null);
    return function (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
        const obj = target.__rx_store_side_effects__ || {};
        target.__rx_store_side_effects__ = { ...obj, [action.type]: descriptor.value };
    }
}