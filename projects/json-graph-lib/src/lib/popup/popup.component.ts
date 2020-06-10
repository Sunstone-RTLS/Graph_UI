import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {AbstractControl, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PopupComponent implements OnInit {

  @Input() editable: boolean;
  @Input() header: string;
  @Input() model: object;
  @Output() modelChange: EventEmitter<object> = new EventEmitter<object>();
  public form: FormGroup;

  constructor() { }

  // instantiating the whole form
  public ngOnInit(): void {
    this.form = new FormGroup({
      // ... instantiating other controls using the model,
      content: new FormGroup({}),
    });
    // building the content form using model.content which is dynamic
    this.buildForm(this.form.get('content') as FormGroup, this.model['content']);
  }

  // building the content form
  private buildForm(group: FormGroup, model: object): void {
    for (const [key, value] of Object.entries(model)) {
      let control: AbstractControl;
      if (value instanceof Object) { // nested group
        control = new FormGroup({});
        this.buildForm(control as FormGroup, value);
      } else { // value
        control = new FormControl({value: value, disabled: !this.editable});
      }
      group.addControl(key, control);
    }
  }

  // helper functions used in the template
  public isGroup(control: AbstractControl): control is FormGroup {
    return control instanceof FormGroup;
  }

  public typeOf(value: any): string {
    return typeof value;
  }

  groupControlNames(param: FormGroup) {
    return Object.keys(param.controls);
  }

  onSubmit(form: FormGroup) {
    this.modelChange.emit(form.value.content);
  }

  // printReturnParent(parent, name, templatelocation) {
  //   console.log('-----------------')
  //   console.log('Show template location: ' + templatelocation);
  //   if (parent) {
  //     console.log('Show parent: ');
  //     console.log(parent);
  //   } else {
  //     console.log('Show parent: ' + parent);
  //   }
  //   console.log('Show name: ' + name);
  //   console.log('-----------------')
  //   return parent;
  // }

}
