import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ResizeEvent } from 'angular-resizable-element';
import { exeSearchBarSchema } from 'src/app/helpers/searchBarValidator';
import { AuthService } from 'src/app/services/auth.service';
import { IProductCategories, IProductsByCategory, IRecentlyOpenedCart, ShoppingService } from 'src/app/services/shopping.service';
import { ModalComponent } from '../app-components/modal/modal.component';
import { ILoginResponse } from '../log-in/log-in.component';

@Component({
  selector: 'app-shopping-page',
  templateUrl: './shopping-page.component.html',
  styleUrls: ['./shopping-page.component.css']
})
export class ShoppingPageComponent implements OnInit{
  @ViewChild(CdkVirtualScrollViewport)
  public viewport!: CdkVirtualScrollViewport;
  public styleLeft: object = {
    "margin-top": "100px",
    "display": "inline-block",
    "width": `31%`,
    "height": "1100px",
    "background-color": "#3f51b5",
    "color": "#121621",
  };
  public styleRight: object = {
    "margin-top": "100px",
    "display": "inline-block",
    "width": `59%`,
    "height": "1100px",
    "background-color": "#3f51b5",
    "color": "#121621",
    "float":"right",
  };
  public divWidth: number | undefined;
  public divWidthRight: number | undefined;
  public productCategoriesList: Array<IProductCategories> | [];
  public products: Array<IProductsByCategory> | [];
  public currentPageNum: number = 1;
  public currentCategoryId: number = 1;
  public isBackButtonPresented: boolean = true;
  public isForwardButtonPresented: boolean = true;
  public isSpinnerOn: boolean = false;
  public selectedCategoryIndex: number | undefined;
  public searchedProduct: undefined | string;
  public timeout: any;
  public isFreeTextSearchModeOn: boolean = false;
  public productsArrayForInfiniteScrolling: [] |  Array<IProductsByCategory>;
  public recentlyOpenedCart: IRecentlyOpenedCart | {};
  public currentProductsInClientOpenCart: [] | ILoginResponse["currentProductsInCart"]
  public loginResponse: ILoginResponse | {};
  public currentCartId: ILoginResponse["currentCartId"];
  public currentTotalCartPrice: string | number | undefined;
  constructor(
    public ShoppingService: ShoppingService, 
    public modalComponent: ModalComponent, 
    public authService: AuthService,
    private router: Router
    ) {
    this.productCategoriesList = [];
    this.products = [];
    this.productsArrayForInfiniteScrolling = [];
    this.recentlyOpenedCart = {};
    this.loginResponse = {};
  }

  async ngOnInit() {
    this.isBackButtonPresented = false;
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
    if (_isILoginResponse(resultSecond)) { 
    this.loginResponse = resultSecond;
    this.currentCartId =  resultSecond.currentCartId;
    this.authService.setTokenLS(resultSecond.token); 
    this.authService.tokenSaver(resultSecond.token);
  }
  console.log(this.authService.openCartExist,this.authService.isNewCustomer,this.authService.openCartNotExist )
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
    if(this.authService.isNewCustomer || this.authService.openCartNotExist) {
      this.currentTotalCartPrice = 0;
      if (!this.authService.userId) throw new Error;
      try{
      const result: any = await this.ShoppingService.openNewCartForClient(
          {userId: Number(this.authService.userId)}
          );
          this.recentlyOpenedCart = result.body.recentlyOpenedCart
          this.currentCartId = result.body.recentlyOpenedCart.id;
      }
      catch(ex){    
      this.modalComponent.errorAlert();
      }
    };
    if (this.authService.openCartExist) {
      if ('currentProductsInCart' in this.authService.loginResponse) {
        const { currentProductsInCart, currentTotalPrice } = this.authService.loginResponse;
        this.currentProductsInClientOpenCart = currentProductsInCart;
        this.currentTotalCartPrice = currentTotalPrice;
      }
    };
    this.isSpinnerOn = true;
    try {
    const result: Array<IProductCategories> = await this.ShoppingService.getProductCategories();
    console.log(result)
    this.productCategoriesList = result;
    }
    catch(ex: any){
      this.modalComponent.errorAlert();
    }
    try {
      const result: Array<IProductsByCategory> | [] = await this.ShoppingService.getProductsByCategory(
        this.currentCategoryId, this.currentPageNum
        );
      this.products = result;
    }catch(ex){
      console.log(ex)
    }finally{
      this.isSpinnerOn = false;
    }
    if (!this.currentProductsInClientOpenCart?.length) this.currentTotalCartPrice = 0;
  };

  onResizeEnd(event: ResizeEvent): void {
    this.divWidth = event.rectangle.width;
    this.divWidthRight = event.rectangle.width;
    this.styleLeft = {
      "margin-top": "100px",
      "display": "inline-block",
      "width": `${1400 - (this.divWidthRight as any)}px`,
      "height": "1100px",
      "background-color": "#3f51b5",
      "color": "#121621",
      "min-width": "16%",
      "max-width": "31%",
    };
    this.styleRight = {
      "margin-top": "100px",
      "display": "inline-block",
      "width": `${this.divWidthRight}px`,
      "height": "1100px",
      "background-color": "#3f51b5",
      "color": "#121621",
      "float":"right",
      "max-width": "84%",
      "min-width": "59%",
      "z-index": "99 !important",
      "position": "relative"
    };
  };

async getFirstPageProductCategory(categoryId: number){
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

async goForwardProductsPageByCategory(){
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

async goBackProductsPageByCategory(){
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

onCategorySelect(categoryIndexInLoop: number){
this.isFreeTextSearchModeOn = false;
this.selectedCategoryIndex = categoryIndexInLoop;
};

async onSubmitNumberOfItems(currentProductId: number){
  let quantity: any;
  try {
  quantity = await this.modalComponent.confirmNumberOfItemsPerThisProduct();
  } catch(ex){
  this.modalComponent.errorAlert();
  }
  if (!quantity) return;
  try {
const result: any = await this.ShoppingService.updateCartForClient({ 
  productId: currentProductId,
  quantity: Number(quantity),
  cartId: this.currentCartId as number
})
  this.currentProductsInClientOpenCart = result.body.currentProductsInCart;
  this.currentTotalCartPrice = result.body.currentTotalCartPrice;
  }catch(ex){
  this.modalComponent.errorAlert();  
  }
};


searchedProducts(){
  // with debounce
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


async getNextSearchedProductsBatch(index: number) {
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

async onDeleteItemsFromCartAction (currentProductLocationInTable: number) {
  try{
  const result = await this.ShoppingService.deleteItemsFromClientOpenCart(currentProductLocationInTable, this.currentCartId as number);
  if ('currentProductsInCart' in result) this.currentProductsInClientOpenCart = result["currentProductsInCart"];
  if ('currentTotalCartPrice' in result) this.currentTotalCartPrice = result["currentTotalCartPrice"];
  }catch(ex){
    console.log(ex)
  this.modalComponent.errorAlert();
  }
};


async onEmptyCartAction () {
  try {
    const result = await this.modalComponent.confirmEmptyCart();
    if (result.isDismissed) return;
  } 
  catch(ex){
    this.modalComponent.errorAlert();
  }
  try{
  const result = await this.ShoppingService.deleteAllItemsFromClientOpenCart(this.currentCartId as number);
  if ('currentProductsInCart' in result) this.currentProductsInClientOpenCart = result["currentProductsInCart"];
  if ('currentTotalCartPrice' in result) this.currentTotalCartPrice = result["currentTotalCartPrice"];
  }catch(ex){
    console.log(ex)
  this.modalComponent.errorAlert();
  }
};

onSubmitOrder () {
  this.router.navigate(['/orders']);
};

}



