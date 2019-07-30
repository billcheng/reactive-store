import { CreatedAction } from './createAction';

export function Reducer<T>(createdAction: CreatedAction<T>): MethodDecorator {
    const action = createdAction(null);
    return function (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
        const array = target.__rx_store_methods__ || [];
        array.push({ method: descriptor.value, type: action.type });
        target.__rx_store_methods__ = array;
    }
}