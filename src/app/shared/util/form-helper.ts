import {AbstractControlOptions, FormBuilder, FormGroup} from "@angular/forms";
import {inject} from "@angular/core";

export class FormHelper {
  private formBuilder = inject(FormBuilder);

  public form!: FormGroup;
  private hasBeenValidated = false;

  private pages!: string[][];
  public currentPage = -1;
  public onLastPage: Function = () => {};

  setPages(controls: string[][]) {
    this.pages = controls;
  }

  showPrev(showAtFirstPage = false): boolean {
    return this.currentPage > 0 - (showAtFirstPage ? 1 : 0) && this.currentPage <= this.pages.length;
  }

  goToPrevPage() {
    if (this.currentPage >= 0) this.currentPage--;
  }

  showNext(): boolean {
    return this.currentPage >= 0 && this.currentPage < this.pages.length;
  }

  isStartPage(): boolean {
    return this.currentPage == -1;
  }

  isConfirmationPage(): boolean {
    return this.currentPage == this.pages.length;
  }

  goToNextPage() {
    if (
      this.currentPage < this.pages.length &&
      this.validateControls(this.pages[this.currentPage]) &&
      this.currentPage++ == this.pages.length - 1
    ) {
      this.onLastPage();
    }
    document.getElementById("form-steps")!.scrollIntoView();
  }

  isDirtyAndInvalid(controlKey?: string) {
    if (controlKey) {
      const control = this.get(controlKey);
      return control.dirty && control.invalid;
    } else {
      return this.hasBeenValidated && this.form.invalid;
    }
  }

  hasSpecificError(controlKey: string, error: string): boolean { //todo change with isDirtyAndInvalidWithError almost everywhere
    const control = this.get(controlKey);
    return !!control.errors?.[error];
  }

  hasFormError(error: string): boolean {
    return !!this.form.errors?.[error];
  }

  isDirtyAndInvalidWithError(controlKey: string, ...errors: string[]) {
    const control = this.get(controlKey);
    if (control?.dirty && control?.invalid) {
      return errors.some(error => control.errors![error]);
    }
    return false;
  }

  createForm<T extends {}>(controls: T, options?: AbstractControlOptions | null) {
    if (this.form) this.form.reset();
    this.hasBeenValidated = false;
    this.form = this.formBuilder.group(controls, options);
  }

  validateAll() {
    this.hasBeenValidated = true;
    this.validateControls(Object.keys(this.form.controls));
  }

  validateControls(controls: string[]): boolean {
    return FormHelper._validateControls(controls, this.form);
  }

  controlValue(control: string) {
    return this.get(control)?.value;
  }

  get(control: string) {
    return this.form?.controls[control];
  }

  get valid() {
    return this.form.valid;
  }

  get invalid() {
    return this.form.invalid;
  }

  get value() {
    return this.form.value;
  }

  static validateControls(group: FormGroup): boolean {
    return this._validateControls(Object.keys(group.controls), group);
  }

  private static _validateControls(controls: string[], group: FormGroup): boolean {
    let valid = true;
    controls.forEach(key => {
      const control = group.get(key)!;
      this.checkForGroups(control as FormGroup);
      if (typeof control.value === 'string') control.setValue(control.value.trim());
      if (control.invalid) {
        valid = false;
        control.markAsDirty();
      }
    });
    return valid;
  }

  private static checkForGroups(control: FormGroup) {
    if (control.controls) {
     this._validateControls(Object.keys(control.controls), control);
    }
  }
}
