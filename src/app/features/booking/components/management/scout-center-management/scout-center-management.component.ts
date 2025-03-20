import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {ScoutCenterService} from "../../../service/scout-center.service";
import {ScoutCenter, ScoutCenterFile, ScoutCenterWithFiles} from "../../../model/scout-center.model";
import {Tab, TabList, TabPanel, TabPanels, Tabs} from "primeng/tabs";
import {CurrencyPipe} from "@angular/common";
import {Button} from "primeng/button";
import {FileUpload, FileUploadHandlerEvent} from "primeng/fileupload";
import {maxFileUploadByteSize} from "../../../../../shared/constant";
import {docTypes, FileUtils} from "../../../../../shared/util/file.utils";
import {AlertService} from "../../../../../shared/services/alert-service.service";
import {
  BasicLoadingInfoComponent
} from "../../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {finalize} from "rxjs";
import {
  GeneralAButtonComponent
} from "../../../../../shared/components/buttons/general-a-button/general-a-button.component";
import {FloatLabel} from "primeng/floatlabel";
import {InputText} from "primeng/inputtext";
import {FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {FormHelper} from "../../../../../shared/util/form-helper";
import {InputNumber} from "primeng/inputnumber";
import {InputGroup} from "primeng/inputgroup";
import {InputGroupAddon} from "primeng/inputgroupaddon";
import {SettingType} from "../../../../settings/setting.model";
import {Dialog} from "primeng/dialog";
import {FormTextAreaComponent} from "../../../../../shared/components/form-text-area/form-text-area.component";

@Component({
  selector: 'app-scout-center-management',
  imports: [
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
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
    FormTextAreaComponent
  ],
  templateUrl: './scout-center-management.component.html',
  styleUrl: './scout-center-management.component.scss'
})
export class ScoutCenterManagementComponent implements OnInit {
  protected readonly scoutCenterService = inject(ScoutCenterService);
  private readonly alertService = inject(AlertService);
  protected scoutCenters!: ScoutCenterWithFiles[];
  protected readonly maxFileUploadByteSize = maxFileUploadByteSize;
  protected readonly docTypes = docTypes;
  protected loading = false;
  protected loadingDelete = false;

  protected editing: boolean = false;
  protected showHelpDialog: boolean = false;
  protected editForm = new FormHelper();
  private formBuilder = inject(FormBuilder);

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
    const tab = FileUtils.openPdfTab();
    return this.scoutCenterService.getRuleFile(centerId).subscribe(response => {
      FileUtils.openPdfFile(response, tab!);
    });
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
      place: [center.name, [Validators.required, Validators.maxLength(127)]],
      price: [center.price / 100, [Validators.required, Validators.min(0)]],
      maxCapacity: [center.maxCapacity, [Validators.required, Validators.min(0)]],
      minExclusiveCapacity: [center.minExclusiveCapacity, [Validators.required, Validators.min(0)]],
      icon: [center.icon, [Validators.required, Validators.maxLength(63)]],
      information: [center.information, [Validators.required, Validators.maxLength(1023)]],
      features: this.formBuilder.array([
        {feature: ["asdasdasd", Validators.required]},
        {feature: ["13123121", Validators.required]}]
      )
    });
    this.editing = true;
  }

  async submit() {
    this.editForm.validateAll();
    // price *= 100
  }

  addFeature() {

  }
}
