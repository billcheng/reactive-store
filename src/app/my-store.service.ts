import { Injectable } from '@angular/core';
import { InitialState, Store, createAction, Reducer, Effect } from 'projects/reactive-store/src/public-api';

export const setBusy = createAction<boolean>('mystore.setBusy');

interface State {
  busy: boolean;
}

@InitialState<State>({
  busy: true
})
@Injectable({
  providedIn: 'root'
})
export class MyStoreService extends Store<State> {

  @Reducer(setBusy)
  setBusyReducer(state: State, payload: boolean) {
    return { ...state, busy: payload };
  }

  @Effect(setBusy)
  setBussyEffect(payload: boolean) {
    console.log(`setBusy to ${payload}`);
  }

}
