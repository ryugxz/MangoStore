import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { FieldsetModule } from 'primeng/fieldset';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from './../../services/product.service';
import { DividerModule } from 'primeng/divider';
import { Product } from './../../model/product.model';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { FileUpload } from 'primeng/fileupload';
import { finalize } from 'rxjs/operators';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ImageModule } from 'primeng/image';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AuthService } from '../../services/auth.service';
import { PromotionPageComponent } from '../promotion-page/promotion-page.component';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DataViewModule,
    ButtonModule,
    TagModule,
    FieldsetModule,
    PaginatorModule,
    DialogModule,
    ReactiveFormsModule,
    DividerModule,
    HttpClientModule,
    FloatLabelModule,
    InputTextModule,
    InputTextareaModule,
    FileUploadModule,
    ConfirmDialogModule,
    ImageModule,
    InputNumberModule,
    InputSwitchModule,
    PromotionPageComponent
  ],
  providers: [
    ProductService  // Register ProductService
  ],
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.scss']
})
export class VendorDashboardComponent implements OnInit {
  displayEditProductDialog: boolean = false;
  displayAddProductDialog: boolean = false;
  displayPromotionDialog: boolean = false;
  products: Product[] = [];
  paginatedProducts: Product[] = [];
  first: number = 0;
  rows: number = 10;
  editingProduct: Product | null = null;
  deleteImageFlag: boolean = false;
  addProductForm: FormGroup;
  editProductForm: FormGroup;
  selectedFile: File | null = null;
  vendor_id: string | null = null;
  imagePreview: string | null = null;
  @ViewChild('fileUploadAdd', { static: false }) fileUploadAdd!: FileUpload;
  @ViewChild('fileUploadEdit', { static: false }) fileUploadEdit!: FileUpload;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private confirmationService: ConfirmationService,
    private authService: AuthService
  ) {
    this.vendor_id = localStorage.getItem('user_id');
    this.addProductForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      vendor_id: [this.vendor_id, Validators.required],
      stock: [0, Validators.required],
      is_available: [false, Validators.required],
      image: [null]
    });

    this.editProductForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, Validators.required],
      is_available: [false, Validators.required],
      image: [null]
    });
  }

  ngOnInit() {
    if (this.vendor_id) {
      this.loadProducts();
    } else {
      console.error('Vendor ID is not available.');
    }
  }

  loadProducts() {
    const vendorId = this.vendor_id ?? undefined; // Convert null to undefined
    const role = this.authService.getRole();
    if (role === 'admin') {      
      this.productService.searchProducts({}).subscribe({
        next: (products) => {
          this.products = Array.isArray(products) ? products : [];
          console.log(products);
          this.updatePaginatedProducts();
        },
        error: (error) => {
          console.error('Error fetching products:', error);
          this.products = [];
          this.updatePaginatedProducts();
        }
      });
    } else if (vendorId) {
      this.productService.searchProducts({ vendor_id: vendorId }).subscribe({
        next: (products) => {
          this.products = Array.isArray(products) ? products : [];
          console.log(products);
          this.updatePaginatedProducts();
        },
        error: (error) => {
          console.error('Error fetching products:', error);
          this.products = [];
          this.updatePaginatedProducts();
        }
      });
    } else {
      console.error('Vendor ID is not available.');
    }
  }

  updatePaginatedProducts() {
    const startIndex = this.first;
    const endIndex = this.first + this.rows;
    this.paginatedProducts = this.products.slice(startIndex, endIndex);
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.updatePaginatedProducts();
  }

  showAddProductDialog() {
    this.displayAddProductDialog = true;
  }

  showPromotionDialog() {
    this.displayPromotionDialog = true;
  }

  showEditProductDialog(product: Product) {
    this.editingProduct = product;
    let is_available_converted = product.is_available ? true : false;
    this.editProductForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      is_available: is_available_converted,
      image: null
    });
    this.imagePreview = product.images && product.images.length > 0 ? product.images[0].image_data : null;
    this.displayEditProductDialog = true;
  }

  onFileChange(event: any) {
    const file: File = event.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        console.error('Invalid file type. Allowed types are JPEG, PNG, JPG, GIF, SVG.');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        console.error('File size should be no more than 2 MB.');
        return;
      }
      this.imagePreview = URL.createObjectURL(file);
      this.selectedFile = file;
      this.addProductForm.patchValue({ image: file });
      this.editProductForm.patchValue({ image: file });
    }
  }

  getSeverity(product: Product) {
    return product.promotion ? 'info' : 'success';
  }

  onAddProduct() {
    if (this.addProductForm.valid) {
      const formData = new FormData();
      formData.append('name', this.addProductForm.get('name')?.value);
      formData.append('description', this.addProductForm.get('description')?.value);
      formData.append('price', this.addProductForm.get('price')?.value);
      formData.append('stock', this.addProductForm.get('stock')?.value);
      formData.append('is_available', this.addProductForm.get('is_available')?.value);

      if (this.vendor_id) {
        formData.append('vendor_id', this.vendor_id);
      } else {
        console.error('Vendor ID is null');
        return;
      }

      if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
      }

      this.productService.addProduct(formData).subscribe({
        next: (newProduct) => {
          console.log('Product added successfully:', newProduct);
          this.refreshProductList();
          this.displayAddProductDialog = false;
          this.resetForm(this.addProductForm);
          this.clearFileSelection('add');
        },
        error: (error) => {
          console.error('Error adding product:', error);
        }
      });
    } else {
      console.error('Form is invalid', this.addProductForm.errors);
      this.logFormErrors(this.addProductForm);
    }
  }

  onEditProduct() {
    if (this.editProductForm.valid && this.editingProduct) {
      const formData = new FormData();
      formData.append('name', this.editProductForm.get('name')?.value);
      formData.append('description', this.editProductForm.get('description')?.value);
      formData.append('price', this.editProductForm.get('price')?.value);
      formData.append('stock', this.editProductForm.get('stock')?.value);
      formData.append('is_available', this.editProductForm.get('is_available')?.value);
      formData.append('delete_image', this.deleteImageFlag ? 'true' : 'false');

      if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
        formData.append('delete_image', 'false');
      }

      this.productService.editProduct(this.editingProduct.id, formData).subscribe({
        next: (updatedProduct) => {
          console.log('Product updated successfully:', updatedProduct);
          this.refreshProductList();
          this.displayEditProductDialog = false;
          this.deleteImageFlag = false;
          this.resetForm(this.editProductForm);
          this.clearFileSelection('edit');
        },
        error: (error) => {
          this.deleteImageFlag = false;
          console.error('Error updating product:', error);
        }
      });
    } else {
      console.error('Form is invalid or editingProduct is null', this.editProductForm.errors);
      this.logFormErrors(this.editProductForm);
    }
  }

  logFormErrors(form: FormGroup) {
    Object.keys(form.controls).forEach(key => {
      const controlErrors = form.get(key)?.errors;
      if (controlErrors != null) {
        console.error(`Key control: ${key}, Errors: `, controlErrors);
      }
    });
  }

  closeAddProductDialog() {
    this.displayAddProductDialog = false;
    this.resetForm(this.addProductForm);
    this.clearFileSelection('add');
  }

  closeEditProductDialog() {
    this.displayEditProductDialog = false;
    this.resetForm(this.editProductForm);
    this.clearFileSelection('edit');
  }

  closePromotionDialog() {
    this.displayPromotionDialog = false;
  }

  clearFileSelection(dialogType: string) {
    this.selectedFile = null;
    this.imagePreview = null;
    this.addProductForm.patchValue({ image: null });
    this.editProductForm.patchValue({ image: null });
    if (dialogType === 'add' && this.fileUploadAdd) {
      this.fileUploadAdd.clear();
    } else if (dialogType === 'edit' && this.fileUploadEdit) {
      this.fileUploadEdit.clear();
    }
  }

  setDeleteImageFlag() {
    this.deleteImageFlag = true;
  }
  
  resetForm(form: FormGroup) {
    form.reset();
    Object.keys(form.controls).forEach(key => {
      form.get(key)?.setErrors(null);
    });
    this.clearFileSelection('add');
    this.clearFileSelection('edit');
  }

  confirmToDelete(productId: number): void {
    this.confirmationService.confirm({
      message: 'คุณยืนยันที่จะลบสินค้าใช่หริอไม่?',
      accept: () => this.deleteProduct(productId)
    });
  }

  deleteProduct(productId: number): void {
    this.productService.deleteProduct(productId).pipe(
      finalize(() => {
        this.refreshProductList();
        // Ensure that the paginator resets to the first page if the last product on the current page is deleted
        if (this.paginatedProducts.length === 0 && this.first > 0) {
          this.first = Math.max(this.first - this.rows, 0);
        }
        this.updatePaginatedProducts();
      })
    ).subscribe({
      next: () => console.log('Product successfully deleted'),
      error: (err) => console.error('Error deleting product:', err)
    });
  }

  refreshProductList() {
    const vendorId = this.vendor_id ?? undefined; // Convert null to undefined
    const role = this.authService.getRole();
    if (role === 'admin') {
      // If the user is an admin, call the service without parameters
      this.productService.searchProducts().subscribe({
        next: (products) => {
          this.products = Array.isArray(products) ? products : [];
          this.updatePaginatedProducts();
        },
        error: (error) => {
          console.error('Error fetching products:', error);
          this.products = [];
          this.updatePaginatedProducts();
        }
      });
    } else if (vendorId) {
      // If the user is not an admin and vendorId is available
      this.productService.searchProducts({ vendor_id: vendorId }).subscribe({
        next: (products) => {
          this.products = Array.isArray(products) ? products : [];
          this.updatePaginatedProducts();
        },
        error: (error) => {
          console.error('Error fetching products:', error);
          this.products = [];
          this.updatePaginatedProducts();
        }
      });
    } else {
      console.error('Vendor ID is not available for refresh.');
    }
  }
}

