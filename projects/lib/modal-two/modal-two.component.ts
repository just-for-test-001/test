import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lib-modal-two',
  imports: [TranslatePipe],
  template: `
    <div>
      <h1>Modal Two : {{ 'title' | translate }}</h1>
    </div>
  `,
  styles: ``,
})
export class ModalTwoComponent {}
