import {Component, inject, OnInit} from '@angular/core';
import {ScoutCenterService} from "../../scout-center.service";
import {ScoutCenter, ScoutCenterFile, ScoutCenterWithFiles} from "../../scout-center.model";
import {TabsModule} from "primeng/tabs";
import {CurrencyPipe, NgClass, NgStyle} from "@angular/common";
import {Button} from "primeng/button";
import {FileUpload, FileUploadHandlerEvent} from "primeng/fileupload";
import {maxFileUploadByteSize} from "../../../../shared/constant";
import {FileUtils} from "../../../../shared/util/file.utils";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {finalize} from "rxjs";
import {
  GeneralAButtonComponent
} from "../../../../shared/components/buttons/general-a-button/general-a-button.component";
import {FloatLabel} from "primeng/floatlabel";
import {InputText} from "primeng/inputtext";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {FormHelper} from "../../../../shared/util/form-helper";
import {InputNumber} from "primeng/inputnumber";
import {InputGroup} from "primeng/inputgroup";
import {InputGroupAddon} from "primeng/inputgroupaddon";
import {Dialog} from "primeng/dialog";
import {FormTextAreaComponent} from "../../../../shared/components/form-text-area/form-text-area.component";
import {SaveButtonsComponent} from "../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {centerIsAlwaysExclusive} from "../../../booking/model/booking.model";
import {ScoutCenterSettingsComponent} from "../scout-center-settings/scout-center-settings.component";

@Component({
  selector: 'app-scout-center-management',
  imports: [
    TabsModule,
    CurrencyPipe,
    Button,
    FileUpload,
    BasicLoadingInfoComponent,
    GeneralAButtonComponent,
    FloatLabel,
    InputText,
    FormsModule,
    ReactiveFormsModule,
    InputNumber,
    InputGroup,
    InputGroupAddon,
    Dialog,
    FormTextAreaComponent,
    NgClass,
    SaveButtonsComponent,
    ScoutCenterSettingsComponent,
    NgStyle
  ],
  templateUrl: './scout-center-management.component.html',
  styleUrl: './scout-center-management.component.scss'
})
export class ScoutCenterManagementComponent implements OnInit {
  protected readonly scoutCenterService = inject(ScoutCenterService);
  private readonly alertService = inject(AlertService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly centerIsAlwaysExclusive = centerIsAlwaysExclusive;
  protected readonly maxFileUploadByteSize = maxFileUploadByteSize;
  protected readonly docTypes = FileUtils.getAllowedExtensions("DOC");
  protected readonly imgTypes = FileUtils.getAllowedExtensions("IMG");

  protected scoutCenters!: ScoutCenterWithFiles[];
  protected loading = false;

  protected loadingDelete = false;
  protected editing: boolean = false;
  protected showHelpDialog: boolean = false;
  protected editForm = new FormHelper();
  protected selectedTab = 1;

  ngOnInit() {
    this.scoutCenterService.getAllWithFiles().subscribe(result => this.scoutCenters = result);
  }

  uploadRule(event: FileUploadHandlerEvent, center: ScoutCenterWithFiles) {
    this.scoutCenterService.uploadRuleFile(center.scoutCenter.id, event.files[0]).subscribe(file => {
      this.alertService.sendBasicSuccessMessage(`Se ha subido el documento ${file.name}`);
      center.rules = file;
    });
  }

  uploadIncidence(event: FileUploadHandlerEvent, center: ScoutCenterWithFiles) {
    this.scoutCenterService.uploadIncidenceFile(center.scoutCenter.id, event.files[0]).subscribe(file => {
      this.alertService.sendBasicSuccessMessage(`Se ha subido el documento ${file.name}`);
      center.incidencesDoc = file;
    });
  }

  uploadAttendance(event: FileUploadHandlerEvent, center: ScoutCenterWithFiles) {
    this.scoutCenterService.uploadAttendanceFile(center.scoutCenter.id, event.files[0]).subscribe(file => {
      this.alertService.sendBasicSuccessMessage(`Se ha subido el documento ${file.name}`);
      center.attendanceDoc = file;
    });
  }

  uploadMainPhoto(event: FileUploadHandlerEvent, center: ScoutCenterWithFiles) {
    this.scoutCenterService.uploadMainPhoto(center.scoutCenter.id, event.files[0]).subscribe(file => {
      this.alertService.sendBasicSuccessMessage(`Se ha subido el documento ${file.name}`);
      center.mainPhoto = file;
    });
  }

  uploadNewPhotos(event: FileUploadHandlerEvent, center: ScoutCenterWithFiles, uploader: FileUpload) {
    this.loading = true;
    this.scoutCenterService.uploadPhotos(center.scoutCenter.id, event.files)
      .pipe(finalize(() => this.loading = false))
      .subscribe(photos => {
        center.photos = photos;
        uploader.clear();
        this.alertService.sendBasicSuccessMessage(`Se han subido ${event.files.length} fotos`);
      });
  }

  openRuleFile(centerId: number) {
    FileUtils.openFile(this.scoutCenterService.getRuleFile(centerId));
  }

  downloadRuleFile(centerId: number) {
    return this.scoutCenterService.getRuleFile(centerId).subscribe(response => {
      FileUtils.downloadFile(response);
    });
  }

  downloadIncidenceFile(centerId: number) {
    return this.scoutCenterService.getIncidenceFile(centerId).subscribe(response => {
      FileUtils.downloadFile(response);
    });
  }

  downloadAttendanceFile(centerId: number) {
    return this.scoutCenterService.getAttendanceFile(centerId).subscribe(response => {
      FileUtils.downloadFile(response);
    });
  }

  removeUploadedFile(file: ScoutCenterFile, center: ScoutCenterWithFiles, index: number) {
    this.loadingDelete = true;
    this.scoutCenterService.removePhoto(center.scoutCenter.id, file.id!)
      .pipe(finalize(() => this.loadingDelete = false))
      .subscribe(() => {
        center.photos.splice(index, 1);
        this.alertService.sendBasicSuccessMessage(`Se ha eliminado el archivo ${file.name}`);
      });
  }

  enableEditMode(center: ScoutCenter) {
    this.editForm.createForm({
      id: center.id,
      name: [center.name, [Validators.required, Validators.maxLength(127)]],
      place: [center.place, [Validators.required, Validators.maxLength(127)]],
      price: [center.price / 100, [Validators.required, Validators.min(0)]],
      maxCapacity: [center.maxCapacity, [Validators.required, Validators.min(0)]],
      minExclusiveCapacity: [center.minExclusiveCapacity, [Validators.required, Validators.min(0)]],
      icon: [center.icon, [Validators.required, Validators.maxLength(63)]],
      color: [center.color, [Validators.required, Validators.maxLength(7)]],
      information: [center.information, [Validators.required, Validators.maxLength(1023)]],
      features: this.formBuilder.array(center.features.map(feature => ([
        feature, [Validators.required, Validators.maxLength(255)]
      ])), Validators.minLength(1))
    });
    this.editing = true;
  }

  submit() {
    if (this.editForm.validateAll()) {
      this.loading = true;
      const scoutCenter: ScoutCenter = this.editForm.value;
      scoutCenter.price *= 100;
      this.scoutCenterService.updateScoutCenter(scoutCenter)
        .pipe(finalize(() => this.loading = false))
        .subscribe(result => {
          this.alertService.sendBasicSuccessMessage(`Se ha guardado el centro scout ${result.name}`);
          this.scoutCenters.find(center => center.scoutCenter.id === result.id)!.scoutCenter = result;
          this.editing = false;
        });
    }
  }

  addFeature(index: number) {
    this.editForm.getFormArray("features").controls.splice(index + 1, 0, (this.formBuilder.control('', [Validators.required, Validators.maxLength(255)])));
  }

  deleteFeature(index: number) {
    const array = this.editForm.getFormArray("features");
    array.removeAt(index);
    if (array.length < 1) this.addFeature(0);
  }
}
