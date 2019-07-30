import { Component } from '@angular/core';
import { MyStoreService, setBusy } from './my-store.service';
import { Observable } from 'rxjs';
import { enableConsoleLog } from 'projects/reactive-store/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  busy$: Observable<boolean>;

  constructor(private store: MyStoreService) {
    enableConsoleLog();
    this.busy$ = store.select(p => p.busy);
  }

  handleBlog() {
    this.store.dispatch(setBusy(!this.store.state.busy));
  }

}
