import {Component, inject, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {ProductService} from "../../services/product.service";
import {Product, ProductForm} from "../../models/product.model";
import {InputText} from "primeng/inputtext";
import {InputNumber} from "primeng/inputnumber";
import {FormTextAreaComponent} from "../../../../shared/components/form-text-area/form-text-area.component";
import {FloatLabel} from "primeng/floatlabel";
import {TableModule} from "primeng/table";
import {FormHelper} from "../../../../shared/util/form-helper";
import {SaveButtonsComponent} from "../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {finalize} from "rxjs";
import {Button} from "primeng/button";
import {FileUpload, FileUploadHandlerEvent} from "primeng/fileupload";
import {maxFileUploadByteSize} from "../../../../shared/constant";
import {FileUtils} from "../../../../shared/util/file.utils";
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";

@Component({
  selector: 'app-product-form',
  imports: [
    ReactiveFormsModule,
    InputText,
    InputNumber,
    FormTextAreaComponent,
    FloatLabel,
    FormsModule,
    TableModule,
    SaveButtonsComponent,
    Button,
    FileUpload,
    BasicLoadingInfoComponent
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {

  private readonly ref = inject(DynamicDialogRef);
  public readonly config = inject(DynamicDialogConfig);
  private readonly productService = inject(ProductService);
  private readonly alertService = inject(AlertService);
  private readonly formBuilder = inject(FormBuilder);
  protected readonly formHelper = new FormHelper();

  protected readonly maxFileUploadByteSize = maxFileUploadByteSize;
  protected readonly allowedFiles = FileUtils.getAllowedExtensions("IMG");

  protected loading = false;
  protected tableControls: any[] = [];
  protected originalProduct: Product | undefined;

  ngOnInit(): void {
    if (this.config.data) {
      this.editForm(this.config.data);
    } else {
      this.initForm();
    }
  }

  private initForm(product?: Product) {
    this.formHelper.createForm({
      name: [product?.name, Validators.required],
      description: [product?.description, [Validators.required, Validators.maxLength(1023)]],
      price: [product ? product.price / 100 : null, [Validators.required, Validators.min(0)]],
      file: [null, this.requiredIfNoImage],
      stockList: this.formBuilder.array(product ? product.stockList.map(stock => this.createSizeControl(stock)) : [])
    });
    this.updateTableControls();
  }

  private readonly requiredIfNoImage: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return !this.originalProduct?.image && !control.value ? {required: true} : null;
  };

  private editForm(productId: number) {
    this.productService.getById(productId).subscribe(product => {
      this.originalProduct = product;
      this.initForm(product);
    });
  }

  protected submitForm() {
    if (this.formHelper.validateAll()) {
      this.loading = true;
      const product = {...this.formHelper.value};
      product.price = Math.round(product.price * 100);
      const file = product.file;
      delete product.file;
      this.saveOrUpdate(product, file)
        .pipe(finalize(() => this.loading = false))
        .subscribe(() => {
          this.alertService.sendBasicSuccessMessage("Producto guardado con éxito");
          this.ref.close(true);
        });
    }
  }

  private saveOrUpdate(form: ProductForm, file: File) {
    if (this.originalProduct) {
      //todo lanzar aviso SI ALGUIEN TIENE UNA COMPRA ACTIVA ... A LO MEJOR TAMBIEN MANDAR MENSAJE AL INICIAR LA EDICION
      return this.productService.update(this.originalProduct.id, form, file);
    } else {
      return this.productService.save(form, file);
    }
  }

  protected addSize() {
    this.sizeArray.push(this.createSizeControl());
    this.updateTableControls();
  }

  protected removeSize(ri: number) {
    this.sizeArray.removeAt(ri);
    this.updateTableControls();
  }

  private updateTableControls() {
    this.tableControls = [...this.sizeArray.controls];
  }

  get sizeArray() {
    return this.formHelper.getFormArray("stockList");
  }

  get formImage(): string {
    return this.productService.getPhotoUrl(this.originalProduct!.image);
  }

  private createSizeControl(stock?: { id: number; size: string; stock: number; }) {
    return this.formBuilder.group({
      id: [stock?.id],
      size: [stock?.size, [Validators.required, Validators.maxLength(255)]],
      stock: [stock?.stock, [Validators.required, Validators.min(0)]],
      originalStock: [stock?.stock],
    });
  }

  public onFileChanged(event: FileUploadHandlerEvent): void {
    this.formHelper.get("file")?.setValue(event.files[0]);
  }

  protected get totalStock() {
    return this.sizeArray.controls.reduce((a, b) => a + (b.get('stock')?.value ?? 0), 0);
  }
}
