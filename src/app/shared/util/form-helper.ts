import {AbstractControlOptions, FormArray, FormBuilder, FormGroup} from "@angular/forms";
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
    this.validateControls(this.pages[this.currentPage]).then(valid => {
      if (valid) {
        document.getElementById("form-steps")?.scrollIntoView();
        this.currentPage++;
        if (this.currentPage == this.pages.length) this.onLastPage();
      }
    });
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

  validateAll(): void {
    this.hasBeenValidated = true;
    this.validateControls(Object.keys(this.form.controls));
  }

  async validateAllWithAsync(): Promise<void> {
    this.hasBeenValidated = true;
    await this.validateControls(Object.keys(this.form.controls));
  }

  private async validateControls(controls: string[]): Promise<boolean> {
    return FormHelper._validateControls(controls, this.form);
  }

  controlValue(control: string) {
    return this.get(control)?.value;
  }

  get(control: string) {
    return this.form?.controls[control];
  }

  getFormArray(control: string) {
    return this.form?.controls[control] as FormArray;
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

  static validateControls(group: FormGroup): void {
    this._validateControls(Object.keys(group.controls), group);
  }

  private static async _validateControls(controls: string[], group: FormGroup): Promise<boolean> {
    let valid = true;
    for (const key of controls) {
      const control = group.get(key)!;
      if (!(await this.checkForGroups(control as FormGroup))) {
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

  private static async checkForGroups(control: FormGroup): Promise<boolean> {
    return control.controls ? await this._validateControls(Object.keys(control.controls), control) : true;
  }
}
