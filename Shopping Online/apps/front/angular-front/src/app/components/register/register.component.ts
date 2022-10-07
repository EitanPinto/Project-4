import { HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { exeRegistrationSchemaStageOne, exeRegistrationSchemaStageTwo } from 'src/app/helpers/registrationValidator';
import { AuthService, IregisterLevelOneResponse, IregisterLevelTwoBody } from 'src/app/services/auth.service';
import { ModalComponent } from '../app-components/modal/modal.component';

const cities = [
  "Haifa", 
  "Jerusalem", 
  "Tel Aviv", 
  "Rishon LeZion", 
  "Ashdod", 
  "Petah Tikva", 
  "Netanya", 
  "Beersheba", 
  "Holon", 
  "Bnei Brak"
];

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public cities: Array<string>;
  public inputId: string| number;
  public inputUsername: string;
  public inputPassword: string;
  public inputConfirmPassword: string;
  public isErrorExistsStageOne: boolean;
  public errorMessageStageOne: string;
  public approvedToProceed: boolean;
  public approvedForStageTwo: boolean;
  public citySelect: string;
  public inputStreet: string;
  public inputHouseNumber: number;
  public inputFirstName: string;
  public inputLastName: string;
  public isErrorExistsStageTwo: boolean;
  public errorMessageStageTwo: string;
  constructor(public authService: AuthService, private router: Router, public modalComponent: ModalComponent) {
    this.inputId = "";
    this.inputUsername = "";
    this.inputPassword = "";
    this.inputConfirmPassword = "";
    this.isErrorExistsStageOne = false;
    this.errorMessageStageOne = "";
    this.approvedToProceed = false;
    this.approvedForStageTwo = false;
    this.cities = cities;
    this.citySelect = "Tel Aviv";
    this.inputStreet = "";
    this.inputHouseNumber = 1;
    this.inputFirstName = "";
    this.inputLastName = "";
    this.isErrorExistsStageTwo = false;
    this.errorMessageStageTwo = "";
  }
  
  ngOnInit() {
  }

  async onRegisterStageOne (){
   try{
    await exeRegistrationSchemaStageOne().validate({
      id: this.inputId, 
      userName: this.inputUsername,
      password: this.inputPassword,
      confirmPassword: this.inputConfirmPassword
    })
  }
  catch(ex: any){
  console.log(ex)
  let errorText = ex.errors[0];
  this.isErrorExistsStageOne = true;
  setTimeout(() => {this.isErrorExistsStageOne = !this.isErrorExistsStageOne; }, 5000);
  if(errorText.includes("/^[0-9]{1,10}$/")) errorText = "ID must be maximum 10 characters of length";
  if(!Number(this.inputId)) errorText = "ID must be valid numbers only, Minimum of 2 characters, Max of 10 and no leading zeros";
  if(errorText.includes("(?=.*[a-z])(?=.*[A-Z]).{6,}/")) errorText = "Password must be an Alpha Numeric (1 Uppercase, 1 Lowercase, 1 Number and at least 6 characters long)";
  this.errorMessageStageOne = errorText;
  return;
  }
  try{
  const result: HttpEvent<HttpResponse<IregisterLevelOneResponse>> | HttpErrorResponse = await this.authService.registerLevelOne(
    {id: Number(this.inputId)}
    );
  if ('status' in result && result.status === 200){
    this.approvedToProceed = true;
  }
  }
  catch(ex: any){
       console.log(ex)
       this.isErrorExistsStageOne = true;
       let errorText: string = "";
       setTimeout(() => {this.isErrorExistsStageOne = !this.isErrorExistsStageOne; }, 5000);
       if(ex.status === 409) errorText = `The submitted ID Already Exists In Our System. 
       If you are a registered user please go to login or forgot password`;
      //  if(ex.status === 403 || ex.status === 500) errorText = "Something went wrong. Please try to submit again after a few seconds"
       else errorText = "Something went wrong. Please try to submit again after a few seconds";
       this.errorMessageStageOne = errorText;
     }
  }

  
onBackButton(): void{
  this.approvedToProceed = false;
};

onNextButton(): void{
  this.approvedForStageTwo = true;
};
async onRegisterStageTwo(){
  try{
  await exeRegistrationSchemaStageTwo().validate({
    city: this.citySelect, 
    street: this.inputStreet,
    houseNumber: this.inputHouseNumber,
    firstName: this.inputFirstName,
    lastName: this.inputLastName
  })
  }
  catch(ex: any){
    console.log(ex)
    let errorText = ex.errors[0];
    this.isErrorExistsStageTwo = true;
    setTimeout(() => {this.isErrorExistsStageTwo = !this.isErrorExistsStageTwo; }, 5000);
    const commonErrorForName = "name must be up to 40 characters of length without special characters or numbers"
    const commonErrorForEmptyString = "name can't be empty"
    if(errorText.includes("firstName")) errorText = `First ${commonErrorForName}`;
    if (!this.inputFirstName) errorText = `First ${commonErrorForEmptyString}`;
    if(errorText.includes("lastName")) errorText = `Last ${commonErrorForName}`;
    if (!this.inputLastName) errorText = `Last ${commonErrorForEmptyString}`;
    if (errorText.includes("houseNumber")) errorText = errorText.replace("houseNumber", "Aprt. / House number");  
    if (errorText.includes("street")) errorText = errorText.replace("street", "Street");  
    this.errorMessageStageTwo = errorText;
    return;
    }
    try{
      const result: HttpEvent<HttpResponse<any>> | HttpErrorResponse = await this.authService.registerLevelTwo(
        {
        id: Number(this.inputId),
        userName: this.inputUsername,
        password: this.inputPassword,
        confirmPassword: this.inputConfirmPassword,
        city: this.citySelect,
        street: this.inputStreet, 
        houseNumber: this.inputHouseNumber, 
        firstName: this.inputFirstName,
        lastName: this.inputLastName
      }
        );
      if ('status' in result && result.status === 200){
        this.router.navigate(['/']);
        this.authService.isNewCustomer = true;
        this.modalComponent.alertWithSuccess('Wonderful !', 'You have Registerd succesfully!', 'success');  
      }
      }
      catch(ex: any){
        this.isErrorExistsStageTwo = true;
        let errorText: string = "";
        setTimeout(() => {this.isErrorExistsStageTwo = !this.isErrorExistsStageTwo; }, 5000);
        if(ex.status === 409) errorText = "This user name already exists in our system. Please try a different one..."
        else errorText = "Something went wrong. Please try to submit again after a few seconds";
        this.errorMessageStageTwo = errorText;
         }
}


onBackButtonStageTwo(): void{
  this.approvedToProceed = !this.approvedToProceed;
  this.approvedForStageTwo = !this.approvedForStageTwo;
}





}
