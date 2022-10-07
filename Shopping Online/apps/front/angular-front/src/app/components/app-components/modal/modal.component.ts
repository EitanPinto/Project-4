import { Component, OnInit } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';  



@Component({  
  selector: 'app-modal',  
  templateUrl: './modal.component.html',  
  styleUrls: ['./modal.component.html']  
})  
export class ModalComponent {  
  
  alertWithSuccess(title: string, text:string, icon: any){  
    Swal.fire(title, text, icon)  
  };  
  errorAlert(){  
    Swal.fire({  
      icon: 'error',  
      title: 'Oops...',  
      text: 'Something went wrong!'
    })  
  };  

  customErrorAlert(title: string, icon: any){  
    Swal.fire({  
      title,
      icon
    })  
  };  
  
  customErrorAlertWithBody(title: string, text:string, icon: any){  
    Swal.fire({  
      title,
      text,
      icon
    })  
  };  

  async confirmNumberOfItemsPerThisProduct(): Promise<SweetAlertResult<any>>{
    const result: SweetAlertResult<any> = await Swal.fire({
      text: "Tell us how many from this product you'd like",
      icon: 'question',
      input: 'number',
      inputValue: 1,
      showCancelButton: true,
      allowOutsideClick: false,
      inputAttributes: {
        min: 1,
        max: 150,
        step: 1
      }
    } as object)
    if (result.isDismissed) Swal.fire(
      'No problema! Go ahead and pick something else',
       '', 
       'info'
       );
    if (result.isConfirmed) Swal.fire(
      `Great! ${result.value} ${Number(result.value) > 1 ? "items were" : "item was"} added to your cart`,
       '', 
       'success'
       );
    return result.value;
    };


 async confirmEmptyCart (): Promise<SweetAlertResult<any>> {
   const result: SweetAlertResult<any> = await Swal.fire({
    title: 'Are you sure you want to empty your cart?',
    text: "You won't be able to revert this",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ff9abc',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, empty my cart please'
  });
  if (result.isConfirmed) Swal.fire(
    '',
    'Your cart has been emptied.',
    'success'
  );
  return result;
 };


 async onSuccessSubmitOrderModal(): Promise<boolean>{
  const result: SweetAlertResult<any> = await Swal.fire({
    title: "Great! your order processed successfully",
    text: "You can download your order reciept here",
    icon: 'success',
    showCancelButton: true,
    confirmButtonText: 'Download reciept',
    confirmButtonColor: '#ff9abc',
    cancelButtonColor: '#d33'
  } as object)
  if (result.isDismissed) {
    const resultSecond = await Swal.fire({
    title: 'Are you sure you don`t want to download the reciept?',
    text: '', 
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#ff9abc',
    confirmButtonText: 'Yes, i`m sure',
    cancelButtonText: 'I want my receipt'
  }); if (resultSecond.isDismissed) return true;
      else return false;
}
  if (result.isConfirmed) return true;
  else return false;
  };

    async onLogOut (): Promise<SweetAlertResult<any>> {
      const result: SweetAlertResult<any> = await Swal.fire({
       title: 'Are you sure you want to log out?',
       text: "",
       icon: 'question',
       showCancelButton: true,
       cancelButtonText: 'Actually, keep me in',
       confirmButtonColor: '#ff9abc',
       cancelButtonColor: '#d33',
       confirmButtonText: 'Yes, log me out please'
     });
     if (result.isConfirmed) Swal.fire(
       '',
       'Your have logged out successfuly',
       'success'
     );
     return result;
    };
}  

