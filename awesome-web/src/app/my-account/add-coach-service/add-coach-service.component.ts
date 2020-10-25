import { NotificationService } from './../../service/notification.service';
import { CoachingServiceComponent } from './../../aws-service/coaching-service/coaching-service.component';
import { CoachingService } from './../../service/coaching.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { StringValidator } from './../../validators/string.validator';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CoachingServiceInterface } from 'src/app/shared/product-info';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'add-coach-service',
  templateUrl: './add-coach-service.component.html',
  styleUrls: ['./add-coach-service.component.scss']
})
export class AddCoachServiceComponent implements OnInit {
  @Output() errors: EventEmitter<any> = new EventEmitter();
  imgSrc: string;
  selectedImage: any = null;

  originalService: CoachingServiceInterface = {
    name: null,
    detail: null,
    imageUrl: null,
    id: null,
    price: null
  };

  service: CoachingServiceInterface = {...this.originalService};

  addServiceForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private storage: AngularFireStorage,
    private coachingService: CoachingService,
    private notificationService: NotificationService
  ) { }


  ngOnInit(): void {
    this.createForm();
  }

  private createForm() {
    this.addServiceForm = this.formBuilder.group({
      serviceName: [this.service.name, [StringValidator.noBlank, Validators.minLength(5)]],
      serviceDetail: [this.service.detail, [StringValidator.noBlank]],
      imageUrl: ['', Validators.required],
      price: [this.service.price, [Validators.pattern(`^(0|[1-9][0-9]*)$`), StringValidator.noBlank]]
    });
  }

  isInvalidControl(controlName: string) {
    const control = this.addServiceForm.controls[controlName];
    return(this.submitted || control.dirty) && control.invalid;
  }

  showPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    }
    else {
      this.imgSrc = '/assets/images/default.png';
      this.selectedImage = null;
    }
  }
  onSubmit(formValue) {
    this.submitted = true;
    this.errors.emit(Object.keys(this.addServiceForm.controls).filter(key => this.addServiceForm.get(key).invalid));
    if (!this.addServiceForm.valid) {
      return;
    }
    if (this.addServiceForm.valid) {
      let filePath = `coaching-service/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.service.name = formValue.serviceName;
            this.service.detail = formValue.serviceDetail;
            this.service.price = formValue.price;
            this.service.imageUrl = url;
            this.coachingService.addCoachingService(this.service);
            this.notificationService.showSuccess('New service has been sucessfully added to the database');
            this.resetServicerForm()
          });
        })
      ).subscribe();
    }
  }

  private resetServicerForm() {
    this.addServiceForm.get('serviceName').reset();
    this.addServiceForm.get('serviceDetail').reset();
    this.addServiceForm.get('imageUrl').reset();
    this.addServiceForm.get('price').reset();
  }

}
