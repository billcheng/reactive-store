export function InitialState<T extends Object>(initialState: T): ClassDecorator {

    return function (target: Function) {
        target.prototype.__rx_store_initial_state__ = initialState;
        target.prototype.__rx_store_key__ = target.name;
    }

}