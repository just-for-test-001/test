import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lib-modal-one',
  imports: [TranslatePipe],
  template: `
    <div>
      <h1>Modal One : {{ 'title' | translate }}</h1>
    </div>
  `,
  styles: ``,
})
export class ModalOneComponent {}
