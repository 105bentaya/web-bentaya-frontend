import {AbstractControlOptions, FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {inject} from "@angular/core";
import {lastValueFrom, skip, take} from "rxjs";

export class FormHelper {
  private readonly formBuilder = inject(FormBuilder);

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

  goToFirstPage() {
    this.currentPage = 0;
    document.getElementById("form-steps")?.scrollIntoView();
  }

  goToNextPage() {
    if (this.currentPage >= this.pages.length) return;
    this.validateControlsAsync(this.pages[this.currentPage]).then(valid => {
      if (valid) {
        document.getElementById("form-steps")?.scrollIntoView();
        this.currentPage++;
        if (this.currentPage == this.pages.length) this.onLastPage();
      }
    });
  }

  isDirtyAndInvalid(...controlKey: string[]) {
    if (controlKey.length > 0) {
      let control = this.get(controlKey[0]);
      for (let i = 1; i < controlKey.length; i++) {
        control = control?.get(controlKey[i])!;
      }
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

  isDirtyAndInvalidWithError(controlKey: string | string[], ...errors: string[]) {
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

  controlValue(control: string) {
    return this.get(control)?.value;
  }

  get(controls: string | string[]) {
    if (typeof controls === "string") {
      return this.form?.controls[controls];
    }

    let control = this.form?.controls[controls[0]];
    for (let i = 1; i < controls.length; i++) {
      control = control?.get(controls[i])!;
    }
    return control;
  }

  getFormArray(control: string) {
    return this.form?.controls[control] as FormArray;
  }

  getFormGroup(group: string) {
    return this.form?.controls[group] as FormGroup;
  }

  getFormGroupControl(group: string, control: string) {
    return this.getFormGroup(group)?.controls[control] as FormControl;
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

  validateAll(): boolean {
    this.hasBeenValidated = true;
    return this.validateControls(Object.keys(this.form.controls));
  }

  private validateControls(controls: string[]): boolean {
    return FormHelper._validateControls(controls, this.form);
  }

  async validateAllWithAsync(): Promise<boolean> {
    this.hasBeenValidated = true;
    return await this.validateControlsAsync(Object.keys(this.form.controls));
  }

  private async validateControlsAsync(controls: string[]): Promise<boolean> {
    return FormHelper._validateControlsAsync(controls, this.form);
  }

  private static _validateControls(controls: string[], group: FormGroup): boolean {
    let valid = true;
    for (const key of controls) {
      const control = group.get(key)!;
      if (!this.checkForGroups(control as FormGroup)) {
        valid = false;
      }
      if (typeof control.value === 'string') control.setValue(control.value.trim());
      control.updateValueAndValidity();
      if ((control.invalid || !control.valid) && control.enabled) {
        valid = false;
        control.markAsDirty();
      }
    }
    return valid;
  }

  private static checkForGroups(control: FormGroup): boolean {
    return control.controls ? this._validateControls(Object.keys(control.controls), control) : true;
  }

  private static async _validateControlsAsync(controls: string[], group: FormGroup): Promise<boolean> {
    let valid = true;
    for (const key of controls) {
      const control = group.get(key)!;
      if (!(await this.checkForGroupsAsync(control as FormGroup))) {
        valid = false;
      }
      if (typeof control.value === 'string') control.setValue(control.value.trim());
      if (control.asyncValidator) {
        const firstStatusChange = lastValueFrom(control.statusChanges.pipe(take(1)));
        const nextStatusChange = lastValueFrom(control.statusChanges.pipe(skip(1), take(1)));
        control.updateValueAndValidity();
        if (await firstStatusChange === "PENDING") await nextStatusChange;
      } else {
        control.updateValueAndValidity();
      }
      if (control.invalid || !control.valid) {
        valid = false;
        control.markAsDirty();
      }
    }
    return valid;
  }

  private static async checkForGroupsAsync(control: FormGroup): Promise<boolean> {
    return control.controls ? await this._validateControlsAsync(Object.keys(control.controls), control) : true;
  }
}
