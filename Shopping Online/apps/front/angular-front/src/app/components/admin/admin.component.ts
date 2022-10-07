import { Component, OnInit, ViewChild } from '@angular/core';
import { IProductCategories, IProductsByCategory, ShoppingService } from 'src/app/services/shopping.service';
import { ModalComponent } from '../app-components/modal/modal.component';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { exeSearchBarSchema } from 'src/app/helpers/searchBarValidator';
import { ILoginResponse } from '../log-in/log-in.component';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AdminService, ICreateItemBody, IupdateItemBody } from 'src/app/services/admin.service';
import { exeUpdateItemSchema } from 'src/app/helpers/updateItemValidator';
import { exeCreateItemSchema } from 'src/app/helpers/createItemValidator';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport)
  public viewport!: CdkVirtualScrollViewport;
  public searchedProduct: undefined | string;
  public productCategoriesList: Array<IProductCategories> | [];
  public productCategoriesListNames: Array<IProductCategories["name"]> | [];
  public selectedCategoryIndex: number | undefined;
  public currentCategoryId: number = 1;
  public currentPageNum: number = 1;
  public products: Array<IProductsByCategory> | [];
  public isBackButtonPresented: boolean = true;
  public isForwardButtonPresented: boolean = true;
  public isFreeTextSearchModeOn: boolean = false;
  public isSpinnerOn: boolean = false;
  public timeout: any;
  public productsArrayForInfiniteScrolling: [] |  Array<IProductsByCategory>;
  public adminTitle: string = "admin"
  public subHeaderActionText: undefined | string;
  public isUpdateModeOn: boolean = false;
  public selectedProduct: undefined | IProductsByCategory;
  public productNameToUpdate: undefined | string;
  public productPriceToUpdate: undefined | number | string;
  public productImageToUpdate: undefined | string;
  public productCategoryNameToUpdate: undefined | string;
  public productCategoryIdToUpdate: undefined | number;
  public isCreateModeOn: boolean = false;
  public productNameToCreate: undefined | string;
  public productPriceToCreate: undefined | number | string;
  public productImageToCreate: undefined | string | null;
  public productCategoryNameToCreate: undefined | string;
  public productCategoryIdToCreate: undefined | number;
  constructor(
    public authService: AuthService, 
    public ShoppingService: ShoppingService, 
    public modalComponent: ModalComponent,
    public adminService: AdminService,
    private router: Router  
    ) {
    this.productCategoriesList = [];
    this.productCategoriesListNames = [];
    this.products = [];
    this.productsArrayForInfiniteScrolling = [];
   }

  async ngOnInit(): Promise<void> {
    try{
      let authToken: string | null = this.authService.getTokenLS();
      if(authToken === null || authToken === "") authToken = "dummyStringToken";
      const result = await this.authService.veirfyLoginForLoggedInUsers(authToken);
      const resultSecond: ILoginResponse | HttpErrorResponse = await this.authService.login({ 
      userName: result.body.userName,
      verifiedToken: true 
    });
      function _isILoginResponse(obj: any): obj is ILoginResponse {
      return 'userName' in obj && 'userResidence' in obj && 'message' in obj && 'token' in obj && 'role' in obj;
    };
      if (_isILoginResponse(resultSecond as ILoginResponse)) {
        if ("role" in resultSecond && resultSecond.role as ILoginResponse["role"] !== this.adminTitle) {
          this.router.navigate(['/']); return;
        }
    }
      }
      catch(ex: any){
        console.log(ex)
        if (ex.status === 401) {this.modalComponent.customErrorAlertWithBody(
          'Something Went Wrong',
          'You can close this window and try Re-Login',
           'error'
           ); 
          }
        this.router.navigate(['/']);
        return;
      }
    try {
      const result: Array<IProductCategories> = await this.ShoppingService.getProductCategories();
      this.productCategoriesList = result;
      this.productCategoriesListNames = result.map((category: IProductCategories)=> category.name)
      }
      catch(ex: any){
        this.modalComponent.errorAlert();
      }
      try{      
        const result: Array<IProductsByCategory> | [] = await this.ShoppingService.getProductsByCategory(
        this.currentCategoryId, this.currentPageNum
        );
      this.products = result;
    }catch(ex){
      console.log(ex)
    }finally{
      this.isSpinnerOn = false;
    }
  }



  async getFirstPageProductCategory(
    categoryId: number, 
    categoryIndexInLoop: number
    ): Promise<void>{
    this.isFreeTextSearchModeOn = false;
    this.selectedCategoryIndex = categoryIndexInLoop;
    this.isBackButtonPresented = false;
    this.currentCategoryId = categoryId;
    this.currentPageNum = 1;
    this.isSpinnerOn = true;
    try{
    const result: Array<IProductsByCategory> | [] = await this.ShoppingService.getProductsByCategory(categoryId, 1);
    this.products = result;
    }
    catch(ex){
      this.modalComponent.errorAlert();
    }finally{
      this.isSpinnerOn = false;
    }
  };


  searchedProducts(): void{
    clearTimeout(this.timeout);
    this.timeout = setTimeout(async () => {
      if(!this.searchedProduct) return; 
      try{
        await exeSearchBarSchema().validate({searchedProduct: this.searchedProduct})
      }
      catch(ex: any){
      console.log(ex.errors[0])
      let errorText = ex.errors[0];
      if(errorText.includes(`${/^[a-zA-Z0-9\s]+$/}`)) {
      errorText = "The search box accepts valid alphBet or numbers only";
      this.modalComponent.customErrorAlertWithBody(
          errorText,
          'You can close this window and try again',
          'error'
           ); 
      return;}
      }
      this.isSpinnerOn = true;
      this.isFreeTextSearchModeOn = true;
      this.currentPageNum = 1;
      try {
      const result: IProductsByCategory[] | [] = await this.ShoppingService.getSearchedProducts(
        this.searchedProduct,
        this.currentPageNum
        );
      this.productsArrayForInfiniteScrolling = result;
    } catch(ex){
    this.modalComponent.errorAlert();
    } finally {
      this.isSpinnerOn = false;
    }
    }, 800);
  };


  
async goForwardProductsPageByCategory(): Promise<void>{
  this.isBackButtonPresented = true;
  this.currentPageNum++;
  this.currentPageNum < 2 ? this.isBackButtonPresented = false : this.isBackButtonPresented = true;
  this.isSpinnerOn = true;
  try{
  const result: Array<IProductsByCategory> | [] = await this.ShoppingService.getProductsByCategory(
    this.currentCategoryId,
    this.currentPageNum
    );
  this.products = result;
}
catch(ex){
  this.modalComponent.errorAlert();
}
finally{
  this.isSpinnerOn = false;
}
  if(!this.products.length) this.isForwardButtonPresented = false;
};

async goBackProductsPageByCategory(): Promise<void>{
  this.isBackButtonPresented = true;
  this.currentPageNum--;
  this.currentPageNum < 2 ? this.isBackButtonPresented = false : this.isBackButtonPresented = true;
  this.isSpinnerOn = true;
  try{
  const result: Array<IProductsByCategory> | [] = await this.ShoppingService.getProductsByCategory(
    this.currentCategoryId, 
    this.currentPageNum
    );
  this.products = result;
}
catch(ex){
  this.modalComponent.errorAlert()
}
finally{
  this.isSpinnerOn = false;
}
  if(this.products.length) this.isForwardButtonPresented = true;
};


async getNextSearchedProductsBatch(index: number): Promise<void> {
  index += 3;
  if (index % 10 === 0) {
    if (this.productsArrayForInfiniteScrolling.length > index) return;
    else {
    this.currentPageNum++;
    try{
    const result: IProductsByCategory[] | [] = await this.ShoppingService.getSearchedProducts(
      this.searchedProduct,
      this.currentPageNum
      );
      this.productsArrayForInfiniteScrolling = [...this.productsArrayForInfiniteScrolling, ...result];
      } catch(ex){
      this.modalComponent.errorAlert();
      }
  };
 };
};


findCategoryName (): IProductCategories {
  const foundCategoryObjInArr: Array<IProductCategories> = this.productCategoriesList.filter(
    categoryObj => categoryObj.id === this.selectedProduct?.category_id);
    const foundCategoryObj: IProductCategories = foundCategoryObjInArr[0];
    return foundCategoryObj;
};

findCategoryID (): IProductCategories {
  const foundCategoryObjInArr: Array<IProductCategories> = this.productCategoriesList.filter(
    categoryObj => categoryObj.name === this.productCategoryNameToUpdate);
    const foundCategoryObj: IProductCategories = foundCategoryObjInArr[0];
    return foundCategoryObj;
};

findCategoryIDForAddItem (): IProductCategories {
  const foundCategoryObjInArr: Array<IProductCategories> = this.productCategoriesList.filter(
    categoryObj => categoryObj.name === this.productCategoryNameToCreate);
    const foundCategoryObj: IProductCategories = foundCategoryObjInArr[0];
    return foundCategoryObj;
};

async onUpdateItemMode(currentProductId: number): Promise<void>{
  this.isUpdateModeOn = true;
  this.isCreateModeOn = false;
  this.subHeaderActionText = "Update The Item Below";
  try{
  this.selectedProduct = await this.adminService.getProductById(currentProductId);
  } catch(ex){
    this.modalComponent.errorAlert();
  }
  this.productPriceToUpdate = this.selectedProduct?.price;
  this.productNameToUpdate = this.selectedProduct?.name;
  this.productImageToUpdate = this.selectedProduct?.image;
  this.productCategoryNameToUpdate = this.findCategoryName().name;
  this.productCategoryIdToUpdate = this.selectedProduct?.id;
};


async onSaveChangesOnProduct() {
  this.productCategoryIdToUpdate = this.findCategoryID().id;
  try {
    await exeUpdateItemSchema().validate({
      id: this.selectedProduct?.id as number,
      name: this.productNameToUpdate,
      categoryId: this.productCategoryIdToUpdate,
      price: Number(this.productPriceToUpdate),
      image: this.productImageToUpdate
    })
  }
// please note below:
// In general - if admin doesnt enter a value in one of the inputs , the value doesnt get transfered to empty string in the DB (continue below)
// its stays the same... if needed in the future I can add a functunality that if entered empty string (no value) it will be deleted in the DB also (continue below)
//  it will require (much) more functuality just for this (in the front and the back) than what I have now. but for now this is the way I chose to do this.
  catch(ex: any){
    let errorText = ex.errors[0];
    this.modalComponent.customErrorAlert(errorText, 'warning'); 
    return;
  }
  if(this.productNameToUpdate === this.selectedProduct?.name &&
    this.productPriceToUpdate === this.selectedProduct?.price && 
    this.productImageToUpdate === this.selectedProduct?.image &&
    this.productCategoryIdToUpdate === this.selectedProduct?.category_id){
      this.modalComponent.customErrorAlertWithBody(
        "You are sending the same values without changing anything!",
         "Close the pop-up and take another look",
         "warning")
         return;
    }
  try{
  const response = await this.adminService.updateItem({
  id: this.selectedProduct?.id as number,
  name: this.productNameToUpdate,
  categoryId: this.productCategoryIdToUpdate,
  price: this.productPriceToUpdate?.toString(),
  image: this.productImageToUpdate
} as IupdateItemBody)
if( "status" in response && response.status === 200){
  this.modalComponent.alertWithSuccess('You have updated the item', '', 'success');  
}
  }catch(ex){
  console.log("error")
  this.modalComponent.errorAlert();  } 
};


onAddItemMode(){
this.isCreateModeOn = true;
this.isUpdateModeOn = false;
this.subHeaderActionText = "Fill The Fields Below To Create An Item";
};


async onSubmitAddItem(){
  try{
  this.productCategoryIdToCreate = this.findCategoryIDForAddItem().id;
  console.log(this.productCategoryNameToCreate)}
  catch(ex){ 
    // didnt entered category
    this.modalComponent.customErrorAlertWithBody(
      "Make sure to fill all fields marked in an asterisk!", 
      "Close the pop up and try again", 
      "warning"
      ); 
   return;}
  try {
    await exeCreateItemSchema().validate({
      name: this.productNameToCreate,
      categoryId: this.productCategoryIdToCreate,
      price: Number(this.productPriceToCreate),
      image: this.productImageToCreate
    })
    if(!this.productImageToCreate) this.productImageToCreate = null;
  }
  catch(ex: any){
    let errorText = ex.errors[0];
    if(errorText.includes("price")) errorText = errorText.replace("price", "Price"); 
    if(errorText.includes("NaN")) errorText = "You did not specify the item`s price"
    this.modalComponent.customErrorAlert(errorText, 'warning'); 
    return;
  };
  try{
    const response = await this.adminService.createItem({
    name: this.productNameToCreate,
    categoryId: this.productCategoryIdToCreate,
    price: this.productPriceToCreate?.toString(),
    image: this.productImageToCreate
  } as ICreateItemBody)
  if( "status" in response && response.status === 200){
    this.modalComponent.alertWithSuccess('You have Created a new item', '', 'success');  
  }
  }catch(ex){
    console.log("error")
    this.modalComponent.errorAlert();  
  }; 
};

};