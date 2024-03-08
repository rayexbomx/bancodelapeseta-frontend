import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { VerificationService } from '../Verification/service/verification.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VerificationCodeService } from '@/CORE/Context/service/verification-code-storage.service';
import { CodeDto } from './dto/codeDto';
import { WInputComponent } from '@/SHARED/Widgets/w-input/input-app';
import { ValidationService } from '@/GENERIC/UTILS/validation.service';


@Component({
  selector: 'app-sms-verification',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink, ReactiveFormsModule, WInputComponent],
  templateUrl: './sms-verification.component.html',
})
export default class SmsVerificationComponent implements OnInit{

  @ViewChildren('inputRef', { read: ElementRef }) inputRefs!: QueryList<ElementRef>;

  code: string = '';

  constructor(
    private verificationService: VerificationService,
    private router: Router,
    private formBuilder: FormBuilder,
    private verificationCodeService: VerificationCodeService,
    private validationService: ValidationService

  ){ }

  verificationCodeForm = this.formBuilder.group({
    // numb1: ['', [Validators.required ]],
    // numb2: ['', [Validators.required ]],
    // numb3: ['', [Validators.required ]],
    // numb4: ['', [Validators.required ]],
    // numb5: ['', [Validators.required ]],
    // numb6: ['', [Validators.required ]],
  });

  inputConfigs = [
    { name: 'numb1', type: 'tel', visible: true },
    { name: 'numb2', type: 'tel', visible: true },
    { name: 'numb3', type: 'tel', visible: true },
    { name: 'numb4', type: 'tel', visible: true },
    { name: 'numb5', type: 'tel', visible: true },
    { name: 'numb6', type: 'tel', visible: true },
  ];

  ngOnInit(): void {

    this.verificationService.sendPhoneVerificationCode('api/v1/send/phone/verification/code').subscribe({
      next: (userData) => {
        this.verificationCodeService.setSmsExpCode(userData['expirationDate'])
        console.log("Send userData sms verification code: ", userData);
        // this.router.navigateByUrl('/sms-verification');
      },
      error: (err) => {
        console.error('No se pudo enviar el código de verificación por correo. El error es: ', err);
      },
      complete: () => {
        // this.verificationCodeForm.reset();
      },
    })
    throw new Error('Method not implemented.');
  }

  onDigitInput(inputIndex: number, event: any) {

    const value = event.event.key;

    // Solo permite números del 1 al 9 y evita otros caracteres
    // if (keyCode < 48 || keyCode > 57 || currentValue.length >= 1) {
    //   event.preventDefault();
    //   return;
    // }

    if (value.toString().length == 1) {
      this.validationService.onDigitInputFocusNext(inputIndex, this.inputRefs)
      // const nextIndex = inputIndex + 1;
      // if (nextIndex < this.inputRefs.length) {
      //   console.log("En obtener el input adecuado: ", nextIndex);
      //   const nextInputRef = this.inputRefs.get(nextIndex);
      //   console.log("nextInputRef: ", nextInputRef);
      //   if (nextInputRef) {
      //     const nextInput = nextInputRef.nativeElement.firstChild;
      //     console.log("nextInput: ", nextInput);
      //     if (nextInput) {
      //       nextInput.focus();
      //     }
      //   }
      // }
    }

  }

  onVerifyCode(){
    this.code = Object.values(this.verificationCodeForm.value).join('');

    if(this.code.length == 0){
      return
    }

    const codeDto = {
      code: this.code
    }

    this.verificationService.verifyPhoneCode(codeDto as CodeDto, 'api/v1/verify/phone').subscribe({

      next: (userData) => {
        this.verificationCodeService.setSmsCode(this.code);
      },
      error: (err) => {
        console.error('Incorrect code: ', err);
      },
      complete: () => {
        this.router.navigateByUrl('/email-verification');
        this.verificationCodeForm.reset();
      },
    })
  }

  // onStringCode(){

  //   const numb1 = this.verificationCodeForm.get('numb1')?.value;
  //   const numb2 = this.verificationCodeForm.get('numb2')?.value;
  //   const numb3 = this.verificationCodeForm.get('numb3')?.value;
  //   const numb4 = this.verificationCodeForm.get('numb4')?.value;
  //   const numb5 = this.verificationCodeForm.get('numb5')?.value;
  //   const numb6 = this.verificationCodeForm.get('numb6')?.value;

  //   this.code = `${numb1}${numb2}${numb3}${numb4}${numb5}${numb6}`;
  //   this.codeDto.code = this.code;

  //   console.log('code: ', this.code);
  // }

}
