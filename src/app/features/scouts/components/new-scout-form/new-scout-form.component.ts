import {Component, inject, OnInit, viewChild} from '@angular/core';
import {PreScout} from "../../../scout-forms/models/pre-scout.model";
import ScoutHelper from "../../scout.util";
import {FormHelper} from "../../../../shared/util/form-helper";
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {DatePicker} from "primeng/datepicker";
import {FloatLabel} from "primeng/floatlabel";
import {InputText} from "primeng/inputtext";
import {Select} from "primeng/select";
import {
  genders,
  maxFileUploadByteSize,
  personTypes,
  relationshipOptions,
  shirtSizes,
  yesNoOptions
} from "../../../../shared/constant";
import {IdentificationDocument, ScoutType} from "../../models/scout.model";
import {IdDocumentFormComponent} from "../id-document-form/id-document-form.component";
import {Steps} from "primeng/steps";
import {MenuItem} from "primeng/api";
import {
  LargeFormButtonsComponent
} from "../../../../shared/components/buttons/large-form-buttons/large-form-buttons.component";
import {SelectButton} from "primeng/selectbutton";
import {FileUpload, FileUploadHandlerEvent} from "primeng/fileupload";
import {Checkbox} from "primeng/checkbox";
import {NgClass, NgTemplateOutlet, TitleCasePipe} from "@angular/common";
import {Tag} from "primeng/tag";
import {ScoutTypeFormComponent} from "../scout-type-form/scout-type-form.component";
import {isNil} from "lodash";
import {ActivatedRoute, Router} from "@angular/router";
import {ScoutFormsService} from "../../../scout-forms/scout-forms.service";
import {LoggedUserDataService} from "../../../../core/auth/services/logged-user-data.service";
import {UserRole} from "../../../users/models/role.model";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {DateUtils} from "../../../../shared/util/date-utils";
import {ScoutService} from "../../services/scout.service";
import {FileType} from "../../../../shared/util/file.utils";
import {
  CheckboxContainerComponent
} from "../../../../shared/components/checkbox-container/checkbox-container.component";
import {finalize, forkJoin, tap} from "rxjs";

type UserDocument = "basicDataDoc" | "bankDoc" | "authorizationDoc" | "imageAuthorizationDoc";

@Component({
  selector: 'app-new-scout-form',
  imports: [
    DatePicker,
    FloatLabel,
    FormsModule,
    InputText,
    ReactiveFormsModule,
    Select,
    IdDocumentFormComponent,
    Steps,
    LargeFormButtonsComponent,
    SelectButton,
    FileUpload,
    Checkbox,
    NgTemplateOutlet,
    Tag,
    NgClass,
    ScoutTypeFormComponent,
    CheckboxContainerComponent
  ],
  templateUrl: './new-scout-form.component.html',
  styleUrl: './new-scout-form.component.scss',
  providers: [TitleCasePipe]
})
export class NewScoutFormComponent implements OnInit {

  protected readonly formHelper = new FormHelper();
  private readonly formBuilder = inject(FormBuilder);
  private readonly preScoutService = inject(ScoutFormsService);
  private readonly scoutService = inject(ScoutService);
  private readonly userData = inject(LoggedUserDataService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly titleCase = inject(TitleCasePipe);
  private readonly alertService = inject(AlertService);

  protected readonly shirtSizes = shirtSizes;
  protected readonly genders = genders;
  protected readonly personTypes = personTypes;
  protected readonly yesNoOptions = yesNoOptions;
  protected readonly relationshipOptions = relationshipOptions;
  protected readonly maxFileUploadByteSize = maxFileUploadByteSize;
  protected readonly steps: MenuItem[] = [
    {label: 'Datos de la Scout'},
    {label: 'Contacto Principal'},
    {label: 'Asociación y Documentación'},
    {label: 'Usuarios'}
  ];

  private readonly uploader = viewChild.required<FileUpload>("scoutDocUploader");
  private readonly documentationFiles: { file: File, control: UserDocument }[] = [];
  private selectedDocument!: UserDocument;

  private preScoutId: number | undefined;
  private isAdmin = false;
  protected loading: boolean = false;

  ngOnInit() {
    const preScoutId = this.route.snapshot.params["preScoutId"];
    this.isAdmin = this.userData.hasRequiredPermission(UserRole.ADMIN);
    if (preScoutId) {
      this.preScoutService.getById(preScoutId).subscribe(res => {
        this.preScoutId = preScoutId;
        this.createForm(res);
      });
    } else {
      this.createForm();
    }
  }

  private createForm(preScout?: PreScout) {
    //todo si hasBeenInGroup, buscar scout y empezar por ahí.

    this.formHelper.createForm({
      name: [this.titleCase.transform(preScout?.name), [Validators.required, Validators.maxLength(255)]],
      feltName: [null, Validators.maxLength(255)],
      surname: [this.titleCase.transform(preScout?.surname), [Validators.required, Validators.maxLength(255)]],
      birthday: [DateUtils.dateOrUndefined(preScout?.birthday), Validators.required],
      gender: [this.titleCase.transform(preScout?.gender), [Validators.required, Validators.maxLength(255)]],
      idDocument: ScoutHelper.idDocumentFormGroup(this.formBuilder, this.getIdDocumentFromPreScout(preScout)),
      shirtSize: [preScout?.size, Validators.maxLength(255)],
      address: [null, Validators.maxLength(255)],
      city: [null, Validators.maxLength(255)],
      province: [null, Validators.maxLength(255)],
      residenceMunicipality: [null, Validators.maxLength(255)],
      phone: [null, Validators.maxLength(255)],
      landline: [null, Validators.maxLength(255)],
      email: [null, [Validators.maxLength(255), Validators.email]],

      contact: this.formBuilder.group({
        personType: ['REAL', Validators.required],
        donor: [null, Validators.required],
        name: [this.titleCase.transform(preScout?.parentsName), [Validators.required, Validators.maxLength(255)]],
        companyName: [this.titleCase.transform(preScout?.parentsName), [Validators.maxLength(255), this.companyNameValidator]],
        surname: [this.titleCase.transform(preScout?.parentsSurname), [Validators.required, Validators.maxLength(255)]],
        relationship: [this.titleCase.transform(preScout?.relationship), [Validators.required, Validators.maxLength(255)]],
        phone: [preScout?.phone, [Validators.required, Validators.maxLength(255)]],
        email: [preScout?.email, [Validators.maxLength(255), Validators.email, Validators.required]],
        studies: [null, Validators.maxLength(255)],
        profession: [null, Validators.maxLength(255)],
        idDocument: ScoutHelper.idDocumentFormGroup(this.formBuilder)
      }),

      iban: [null, [Validators.required, ScoutHelper.ibanValidator]],
      bank: [null, [Validators.required, Validators.maxLength(255)]],
      basicDataDoc: [false, this.requiredTrueIfScout],
      bankDoc: [false, this.requiredTrueIfScout],
      authorizationDoc: [false, this.requiredTrueIfScout],
      imageAuthorizationDoc: [false],
      scoutType: [preScout ? "SCOUT" : null, Validators.required],
      groupId: [preScout?.assignation?.group.id ?? null, this.groupValidation],
      census: [null],
      firstActivityDate: [null, Validators.required],
      imageAuthorization: [true, Validators.required],
      contactUser: [false],
      scoutUser: [false]
    });
    this.formHelper.currentPage = 0;
    this.formHelper.setPages([
      [
        "name", "feltName", "surname", "birthday", "gender", "idDocument", "shirtSize", "address", "city", "province",
        "residenceMunicipality", "phone", "landline", "email"
      ],
      ["contact"],
      [
        "iban", "bank", "basicDataDoc", "bankDoc", "authorizationDoc", "imageAuthorizationDoc", "census", "scoutType",
        "groupId", "firstActivityDate", "imageAuthorization", "contactUser", "scoutUser"
      ]
    ]);

    if (this.preScoutId && !this.isAdmin) {
      this.formHelper.get("scoutType")?.disable();
      this.formHelper.get("groupId")?.disable();
    }
    this.formHelper.get("contact")?.get("idDocument")?.get("idType")?.addValidators(Validators.required);
    this.formHelper.get("imageAuthorization")?.disable();
  }

  private getIdDocumentFromPreScout(preScout?: PreScout): IdentificationDocument | undefined {
    const number = preScout?.dni;
    if (number) {
      if (ScoutHelper.dniIsValid(number)) {
        return {idType: "DNI", number};
      } else if (ScoutHelper.cifIsValid(number)) {
        return {idType: "CIF", number};
      } else if (ScoutHelper.nieIsValid(number)) {
        return {idType: "NIE", number};
      } else {
        return {idType: undefined!, number};
      }
    }
    return undefined;
  }

  private readonly groupValidation: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const scoutType: ScoutType = this.formHelper.get("scoutType")?.value;
    return isNil(control.value) && (scoutType === "SCOUT" || scoutType === "SCOUTER") ? {groupRequired: true} : null;
  };

  private readonly companyNameValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return !this.contactIsReal && !control.value ? {required: true} : null;
  };

  private readonly requiredTrueIfScout: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return this.scoutType === "SCOUT" && !control.value ? {required: true} : null;
  };

  protected get contactIsReal() {
    return this.formHelper.getFormGroup("contact")?.get("personType")!.value === "REAL";
  }

  protected get scoutType(): ScoutType {
    return this.formHelper.controlValue("scoutType");
  }

  protected get showCensus() {
    return this.isAdmin;
  }

  protected submit() {
    if (this.formHelper.validateAll()) {
      this.loading = true;
      const scoutForm = {...this.formHelper.value};
      scoutForm.scoutType = this.formHelper.controlValue("scoutType");
      scoutForm.groupId = this.formHelper.controlValue("groupId");
      scoutForm.imageAuthorization = this.formHelper.controlValue("imageAuthorization");

      delete scoutForm.basicDataDoc;
      delete scoutForm.bankDoc;
      delete scoutForm.authorizationDoc;
      delete scoutForm.imageAuthorizationDoc;

      scoutForm.firstActivityDate = DateUtils.toLocalDate(scoutForm.firstActivityDate);
      scoutForm.birthday = DateUtils.toLocalDate(scoutForm.birthday);

      if (scoutForm.idDocument && (!scoutForm.idDocument.idType || !scoutForm.idDocument.number)) {
        delete scoutForm.idDocument;
      }

      if (scoutForm.contact.personType === "REAL") {
        delete scoutForm.contact.companyName;
      } else {
        delete scoutForm.contact.profession;
        delete scoutForm.contact.studies;
      }

      if (scoutForm.scoutType === "MANAGER" || scoutForm.scoutType === "COMMITTEE" || scoutForm.scoutType == "INACTIVE") {
        scoutForm.groupId = undefined;
      }

      this.checkFormEmails(scoutForm);

      this.scoutService.saveNewScout(scoutForm).subscribe({
        next: scout => {
          this.alertService.sendBasicSuccessMessage("Scout creada correctamente");
          const subs = this.documentationFiles.map(file => this.uploadFile(scout.id, file));
          forkJoin(subs)
            .pipe(finalize(() => this.router.navigate(
              ["/scouts", scout.id],
              {queryParams: {fromForm: true}}
            ))).subscribe();
        }, error: () => this.loading = false
      });
    } else {
      this.alertService.sendMessage({
        title: "Datos incorrectos",
        severity: "warn",
        message: "Hay datos del formulario que no están correctos. Vuelva hacia atrás para corregirlos."
      });
    }
  }

  private checkFormEmails(scoutForm: any) {
    const userEmails = [];
    if (scoutForm.contactUser && scoutForm.scoutType === "SCOUT") {
      userEmails.push(scoutForm.contact.email);
    }
    if (scoutForm.scoutUser && (scoutForm.scoutType === "SCOUT" || scoutForm.scoutType === "SCOUTER")) {
      userEmails.push(scoutForm.email);
    }
    delete scoutForm.contactUser;
    delete scoutForm.scoutUser;
    scoutForm.scoutUsers = userEmails;

    if (this.preScoutId) {
      scoutForm.preScoutId = this.preScoutId;
    }
  }

  private uploadFile(scoutId: number, documentationFile: { file: File, control: UserDocument }) {
    const fileType: FileType = documentationFile.control === "bankDoc" ? "ECONOMIC" : "PERSONAL";
    const fileName = this.getDocLabel(documentationFile.control);
    return this.scoutService.uploadDocument(scoutId, documentationFile.file, fileType, fileName).pipe(tap(() => {
      this.alertService.sendBasicSuccessMessage(`Documento - ${fileName} subido`);
    }));
  }

  protected selectFile(event: FileUploadHandlerEvent) {
    const file = event.files[0];
    this.documentationFiles.push({
      file,
      control: this.selectedDocument
    });
    if (this.selectedDocument === "imageAuthorizationDoc") {
      const imageAuthControl = this.formHelper.get("imageAuthorization");
      imageAuthControl.setValue(null);
      imageAuthControl.enable();
    }
    this.formHelper.get(this.selectedDocument)?.setValue(true);
  }

  protected deleteFile(control: UserDocument) {
    const index = this.documentationFiles.findIndex(file => file.control === control);
    const deletedDoc = this.documentationFiles.splice(index, 1)[0];
    if (control === "imageAuthorizationDoc") {
      const imageAuthControl = this.formHelper.get("imageAuthorization");
      imageAuthControl.setValue(true);
      imageAuthControl.disable();
    }
    this.formHelper.get(deletedDoc.control)?.setValue(false);
  }

  protected openUploader(control: UserDocument) {
    this.uploader().el.nativeElement.getElementsByClassName("p-fileupload-choose-button")[0].click();
    this.selectedDocument = control;
  }

  protected getDocContext(document: UserDocument) {
    return {
      invalid: this.formHelper.isDirtyAndInvalid(document),
      checked: this.formHelper.controlValue(document),
      required: document !== "imageAuthorizationDoc",
      label: this.getDocLabel(document),
      control: document
    };
  }

  private getDocLabel(document: UserDocument): string {
    switch (document) {
      case "basicDataDoc":
        return "Inscripción";
      case "bankDoc":
        return "Datos bancarios";
      case "authorizationDoc":
        return "Autorización anual";
      case "imageAuthorizationDoc":
        return "Permiso de imagen";
    }
  }
}
