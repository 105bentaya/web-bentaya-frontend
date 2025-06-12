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
import {IdentificationDocument, Scout, ScoutType} from "../../models/scout.model";
import {IdDocumentFormComponent} from "../id-document-form/id-document-form.component";
import {Steps} from "primeng/steps";
import {MenuItem} from "primeng/api";
import {
  LargeFormButtonsComponent
} from "../../../../shared/components/buttons/large-form-buttons/large-form-buttons.component";
import {SelectButton} from "primeng/selectbutton";
import {FileUpload, FileUploadHandlerEvent} from "primeng/fileupload";
import {Checkbox} from "primeng/checkbox";
import {DatePipe, NgClass, NgTemplateOutlet, TitleCasePipe} from "@angular/common";
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
import {NewScoutForm} from "../../models/scout-form.model";
import {BasicInfoComponent} from "../basic-info/basic-info.component";
import {IdDocumentPipe} from "../../pipes/id-document.pipe";
import {IdDocumentTypePipe} from "../../pipes/id-document-type.pipe";
import {BooleanPipe} from "../../../../shared/pipes/boolean.pipe";
import {JoinPipe} from "../../../../shared/pipes/join.pipe";
import {GroupService} from "../../../../shared/services/group.service";
import {BasicGroupInfo} from "../../../../shared/model/group.model";
import {ScoutGroupPipe} from "../../pipes/scout-group.pipe";
import {CensusPipe} from "../../pipes/census.pipe";
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {Button} from "primeng/button";

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
    CheckboxContainerComponent,
    BasicInfoComponent,
    DatePipe,
    IdDocumentPipe,
    IdDocumentTypePipe,
    BooleanPipe,
    JoinPipe,
    ScoutGroupPipe,
    CensusPipe,
    BasicLoadingInfoComponent,
    Button
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
  private readonly groupService = inject(GroupService);

  protected readonly shirtSizes = shirtSizes;
  protected readonly genders = genders;
  protected readonly personTypes = personTypes;
  protected readonly yesNoOptions = yesNoOptions;
  protected readonly relationshipOptions = relationshipOptions;
  protected readonly maxFileUploadByteSize = maxFileUploadByteSize;
  protected steps: MenuItem[] = [
    {label: 'Datos Asociativos'},
    {label: 'Datos de la Scout'},
    {label: 'Contacto Principal'},
    {label: 'Documentación y Usuarios'},
    {label: 'Confirmación'}
  ];

  private readonly uploader = viewChild.required<FileUpload>("scoutDocUploader");
  private readonly documentationFiles: { file: File, control: UserDocument }[] = [];
  private selectedDocument!: UserDocument;

  protected preScout: PreScout | undefined;
  protected preScoutHasBeenInGroup: boolean = false;
  protected previousScout!: Scout;

  private isSecretary = false;
  protected loading: boolean = false;
  protected scoutFormToSave!: NewScoutForm;
  private groups!: BasicGroupInfo[];

  ngOnInit() {
    this.groupService.getBasicGroups({generalGroup: true}).subscribe(data => this.groups = data);

    const preScoutId = this.route.snapshot.params["preScoutId"];
    this.isSecretary = this.userData.hasRequiredPermission(UserRole.SECRETARY);
    if (preScoutId) {
      this.preScoutService.getById(preScoutId).subscribe(preScout => {
        this.preScout = preScout;
        if (preScout.hasBeenInGroup) {
          this.scoutService.findScoutsLikeHasBeenInGroup(preScoutId).subscribe(scout => {
            this.previousScout = scout;
            this.preScoutHasBeenInGroup = true;
          });
        } else {
          this.createForm(preScout);
        }
      });
    } else {
      this.createForm();
    }
  }

  private createForm(preScout?: PreScout, previousScout?: Scout) {
    this.formHelper.createForm({
      name: [this.titleCase.transform(preScout?.name), [Validators.required, Validators.maxLength(255)]],
      feltName: [previousScout?.personalData.feltName, Validators.maxLength(255)],
      surname: [this.titleCase.transform(preScout?.surname), [Validators.required, Validators.maxLength(255)]],
      birthday: [preScout?.birthday ? new Date(preScout.birthday.split("/").reverse().join("-")) : null, Validators.required],
      gender: [this.titleCase.transform(preScout?.gender), [Validators.required, Validators.maxLength(255)]],
      idDocument: ScoutHelper.idDocumentFormGroup(this.formBuilder, this.getIdDocumentFromPreScout(preScout)),
      shirtSize: [preScout?.size, Validators.maxLength(255)],
      address: [previousScout?.personalData.address, Validators.maxLength(255)],
      city: [previousScout?.personalData.city, Validators.maxLength(255)],
      province: [previousScout?.personalData.province, Validators.maxLength(255)],
      residenceMunicipality: [null, Validators.maxLength(255)],
      phone: [previousScout?.personalData.phone, [Validators.maxLength(255), this.requiredIfScouterOrSupport]],
      landline: [previousScout?.personalData.landline, Validators.maxLength(255)],
      email: [previousScout?.personalData.email, [Validators.maxLength(255), Validators.email, this.requiredIfScouterOrSupport]],

      contact: this.formBuilder.group({
        personType: ['REAL', this.requiredIfScout],
        donor: [null, this.requiredNotNullIfScout],
        name: [this.titleCase.transform(preScout?.parentsName), [this.requiredIfScout, Validators.maxLength(255)]],
        companyName: [this.titleCase.transform(preScout?.parentsName), [Validators.maxLength(255), this.companyNameValidator]],
        surname: [this.titleCase.transform(preScout?.parentsSurname), [this.requiredIfScout, Validators.maxLength(255)]],
        relationship: [this.titleCase.transform(preScout?.relationship), [this.requiredIfScout, Validators.maxLength(255)]],
        phone: [preScout?.phone, [this.requiredIfScout, Validators.maxLength(255)]],
        email: [preScout?.email, [Validators.maxLength(255), Validators.email, this.requiredIfScout]],
        studies: [null, Validators.maxLength(255)],
        profession: [null, Validators.maxLength(255)],
        idDocument: ScoutHelper.idDocumentFormGroup(this.formBuilder)
      }),

      iban: [null, [this.requiredIfScout, ScoutHelper.ibanValidator]],
      bank: [null, [this.requiredIfScout, Validators.maxLength(255)]],
      basicDataDoc: [false, this.requiredIfScout],
      bankDoc: [false, this.requiredIfScout],
      authorizationDoc: [false, this.requiredIfScout],
      imageAuthorizationDoc: [false],
      scoutType: [preScout ? "SCOUT" : null, Validators.required],
      groupId: [preScout?.assignation?.group.id ?? null, this.groupValidation],
      census: [previousScout?.scoutInfo.census],
      firstActivityDate: [null, Validators.required],
      imageAuthorization: [true, Validators.required],
      contactUser: [false],
      scoutUser: [false],
      existingScoutId: [previousScout?.id]
    });
    this.formHelper.currentPage = 0;
    this.formHelper.onLastPage = () => this.createScoutForm();
    this.formHelper.onNextPageChange = () => this.onNextPageChange();
    this.formHelper.onPrevPageChange = () => this.onPrevPageChange();

    this.formHelper.setPages([
      ["census", "scoutType", "groupId"],
      [
        "name", "feltName", "surname", "birthday", "gender", "idDocument", "shirtSize", "address", "city", "province",
        "residenceMunicipality", "phone", "landline", "email"
      ],
      ["contact"],
      [
        "iban", "bank", "basicDataDoc", "bankDoc", "authorizationDoc", "imageAuthorizationDoc", "firstActivityDate",
        "imageAuthorization", "contactUser", "scoutUser"
      ]
    ]);

    if (this.preScout && !this.isSecretary) {
      this.formHelper.get("scoutType")?.disable();
      this.formHelper.get("groupId")?.disable();
    }
    this.formHelper.get("contact")?.get("idDocument")?.get("idType")?.addValidators(this.requiredIfScout);
    this.formHelper.get("imageAuthorization")?.disable();
  }

  private onNextPageChange() {
    if (this.checkForPage) {
      this.formHelper.goToNextPage();
    }
  }

  private onPrevPageChange() {
    if (this.checkForPage) {
      this.formHelper.goToPrevPage();
    }
  }

  private get checkForPage() {
    return this.scoutType !== "SCOUT" && this.formHelper.currentPage === 2;
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
      }
    }
    return undefined;
  }

  private readonly groupValidation: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const scoutType: ScoutType = this.formHelper.get("scoutType")?.value;
    return isNil(control.value) && (scoutType === "SCOUT" || scoutType === "SCOUTER") ? {groupRequired: true} : null;
  };

  private readonly companyNameValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return !this.contactIsReal && this.scoutType === "SCOUT" && !control.value ? {required: true} : null;
  };

  private readonly requiredIfScout: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return this.scoutType === "SCOUT" && !control.value ? {required: true} : null;
  };

  private readonly requiredIfScouterOrSupport: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return this.scoutIsScouterOrSupport && !control.value ? {required: true} : null;
  };

  private readonly requiredNotNullIfScout: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return this.scoutType === "SCOUT" && isNil(control.value) ? {required: true} : null;
  };

  protected get contactIsReal() {
    return this.formHelper.getFormGroup("contact")?.get("personType")!.value === "REAL";
  }

  protected get scoutType(): ScoutType {
    return this.formHelper.controlValue("scoutType");
  }

  protected get scoutIsScouterOrSupport(): boolean {
    return this.scoutType === "SCOUTER" || this.scoutType === "MANAGER" || this.scoutType === "COMMITTEE";
  }

  protected get scoutGroup() {
    return this.groups.find(group => group.id === this.scoutFormToSave.groupId);
  }

  private createScoutForm() {
    if (this.formHelper.validateAll()) {
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

      if (scoutForm.scoutType !== "SCOUT") {
        delete scoutForm.contact;
      } else if (scoutForm.contact.personType === "REAL") {
        delete scoutForm.contact.companyName;
      } else {
        delete scoutForm.contact.profession;
        delete scoutForm.contact.studies;
      }

      if (scoutForm.scoutType === "MANAGER" || scoutForm.scoutType === "COMMITTEE" || scoutForm.scoutType == "INACTIVE") {
        scoutForm.groupId = undefined;
      }

      this.checkFormEmails(scoutForm);

      if (this.preScout) {
        scoutForm.preScoutId = this.preScout.id;
      }
      scoutForm.hasBeenBefore = this.preScoutHasBeenInGroup;

      if (!this.isSecretary) {
        delete scoutForm.census;
      }

      this.scoutFormToSave = scoutForm;
    } else {
      this.formHelper.currentPage = 3;
      this.alertService.sendMessage({
        title: "Datos incorrectos",
        severity: "warn",
        message: "Hay datos del formulario que no están correctos. Vuelva hacia atrás para corregirlos."
      });
    }
  }

  protected submit() {
    this.loading = true;
    this.scoutService.saveNewScout(this.scoutFormToSave).subscribe({
      next: scout => {
        this.alertService.sendBasicSuccessMessage("Scout creada correctamente");
        if (scout.scoutInfo.scoutType === "SCOUT") {
          const subs = this.documentationFiles.map(file => this.uploadFile(scout.id, file));
          forkJoin(subs)
            .pipe(finalize(() => this.navigateToDetail(scout.id))).subscribe();
        } else {
          this.navigateToDetail(scout.id);
        }
      }, error: () => this.loading = false
    });
  }

  private navigateToDetail(id: number) {
    this.router.navigate(["/scouts", id], {queryParams: {fromForm: true}});
  }

  private checkFormEmails(scoutForm: any) {
    const userEmails = [];
    if (scoutForm.contactUser && scoutForm.scoutType === "SCOUT") {
      userEmails.push(scoutForm.contact.email);
    }
    if (scoutForm.scoutUser && scoutForm.scoutType !== "INACTIVE") {
      userEmails.push(scoutForm.email);
    }
    delete scoutForm.contactUser;
    delete scoutForm.scoutUser;
    scoutForm.scoutUsers = userEmails;
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

  protected startFromHasBeenBefore() {
    if (this.previousScout) {
      this.createForm(this.preScout, this.previousScout);
    } else {
      this.createForm(this.preScout);
    }
  }
}
