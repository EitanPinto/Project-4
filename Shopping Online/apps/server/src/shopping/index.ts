import { Router, Request, Response, NextFunction } from "express";
import { getGeneralErrorText } from "../helpers/errorTextFns";
import { TypedRequestQuery } from "../validateFrontToken";
import { TypedRequestBody } from "../auth";
import { icons } from "../misc/icons";
import { 
  getCustomerOpenCartCurrentProductsStepThree, 
  IGetOpenCartDetailsStepThree, 
  getCustomerOpenCartStepTwo
} from "../auth/businessLogic";
import { 
  validateParamsForDeleteActionFromOpenCart, 
  validateParamsForCartUpdate, 
  validateOpenNewCartBody, 
  validateSearchBarQuery, 
  IupdateCartBody
} from "../middlewares/joiValidations";
import { 
  getSearchedProductsByFreeText, 
  checkIfDatesOkForShipping,
  deleteFromUserOpenCart,
  getCurrentProductPrice,
  getProductsByCategory, 
  getRecentlyOpenedCart, 
  getProductCategories, 
  IProductsByCategory,
  IRecentlyOpenedCart,
  IproductCategories, 
  openNewCartForUser,
  updateUserOpenCart
} from "./businessLogic";

const shoppingRouter: Router = Router();

shoppingRouter.get(
  "/product_categories", 
  getProductCategoriesHandler
  );

shoppingRouter.get(
  "/products_by_category", 
  getProductsByCategoryHandler
  );

shoppingRouter.get(
  "/search_products_by_free_text",
  validateSearchBarQuery, 
  getSearchedProductsByFreeTextHandler
  );

shoppingRouter.post(
  "/open_new_cart",
  validateOpenNewCartBody,
  openNewCartForUserHandler
  );

shoppingRouter.put(
  "/update_open_cart",
  validateParamsForCartUpdate,
  updateUserOpenCartHandler
  );

shoppingRouter.delete(
  "/delete_from_open_cart",
  validateParamsForDeleteActionFromOpenCart,
  deleteFromUserOpenCartHandler
  );


shoppingRouter.get(
  "/check_if_dates_ok_for_shipping",
  checkIfDatesOkForShippingHandler
  );

async function getProductCategoriesHandler(
  req: Request, 
  res: Response, 
  next: NextFunction
  ): Promise<void> {
try {
const productCategories: Array<IproductCategories> = await getProductCategories();
res.status(200).json({
  productCategories,
  message: `<<${icons.loginSuccess}>> Fetching All Product Categories Process Completed Successfully <<${icons.loginSuccess}>>`
})
return;
} catch(ex: unknown){
  console.log(ex)
  res.status(403).send(getGeneralErrorText("Fetching All Product Categories"));
  return;
};
};

async function getProductsByCategoryHandler(
  req: TypedRequestQuery<{ 
    categoryId: string, 
    page: string 
  }>, 
  res: Response, 
  next: NextFunction
  ): Promise<void>{
  const { categoryId, page } = req.query;
  let currentPageNum: number;
  if(!page) currentPageNum = 0;
  currentPageNum = Number(page);
  if(isNaN(currentPageNum)) currentPageNum = 0;
  if (!categoryId) {
    res.status(400).json({
      message: `<<${icons.somethingWentWrong}>> Missing Essential Parameters <<${icons.somethingWentWrong}>>`
  }); return; }
  const categoryIdNum: number = Number(categoryId);
  if (categoryIdNum === 0) {
    res.status(422).json({
      message: `<<${icons.warning}>> Category Id Must Be Bigger Than 0 In Order To Process <<${icons.warning}>>`
  }); return; }
  if (isNaN(categoryIdNum)) { 
    res.status(422).json({
      message: `<<${icons.warning}>> Category Id Must Be a Valid Number In Order To Process <<${icons.warning}>>`
  }); return; }
  try{
  const products: [] | Array<IProductsByCategory> = await getProductsByCategory(categoryIdNum, currentPageNum)
    res.status(200).json({ 
    message: `<<${icons.loginSuccess}>> Get Products By Category ( ID No. ${categoryIdNum} ) Success <<${icons.loginSuccess}>>`,
    products
    }); return;
  } catch(ex: unknown){
    console.log(ex)
    res.status(403).send(getGeneralErrorText("Get Products By Category")); return;
  };
};

async function getSearchedProductsByFreeTextHandler(
  req: TypedRequestQuery<{
     searchedProduct: string, 
     page: string 
    }>, 
  res: Response, 
  next: NextFunction
  ): Promise<void>{
  const { searchedProduct, page } = req.query;
  // searchProduct already been validated by joi
  let currentPageNum: number;
  if(!page) currentPageNum = 0;
  currentPageNum = Number(page);
  if(isNaN(currentPageNum)) currentPageNum = 0;
  try{
  const products: [] | Array<IProductsByCategory> = await getSearchedProductsByFreeText(searchedProduct, currentPageNum)
    res.status(200).json({ 
    message: `<<${icons.loginSuccess}>> Searched Products: '${searchedProduct}' - Processed Successfully <<${icons.loginSuccess}>>`,
    products
    }); return;
  } catch(ex: unknown){
    console.log(ex)
    res.status(403).send(getGeneralErrorText("Search Products In DB")); return;
  };
};

async function openNewCartForUserHandler(
  req: TypedRequestBody<{userId: number}>, 
  res: Response, 
  next: NextFunction
  ): Promise<void> {
  const { userId } = req.body;
  try{
  await openNewCartForUser(userId);
  const recentlyOpenedCart: IRecentlyOpenedCart = await getRecentlyOpenedCart(userId);
    res.status(200).json({
    message: `<<${icons.loginSuccess}>> Open New Cart For Client Process Completed Successfully - Cart No. ${recentlyOpenedCart.id} <<${icons.loginSuccess}>>`,
    recentlyOpenedCart
    }); return;
  } 
  catch(ex: unknown){
    console.log(ex)
    res.status(403).send(getGeneralErrorText("Open New Cart For Client")); return;
  }; 
};

async function updateUserOpenCartHandler(
  req: TypedRequestBody<IupdateCartBody>, 
  res: Response, 
  next: NextFunction
  ): Promise<void> {
  try{
  const { productId, cartId } = req.body;
  const currentProductPrice: string = await getCurrentProductPrice(productId);
  await updateUserOpenCart(req.body, currentProductPrice);
  const currentProductsInCart: Array<IGetOpenCartDetailsStepThree> = 
  await getCustomerOpenCartCurrentProductsStepThree(cartId);
  const currentTotalCartPrice: string = await getCustomerOpenCartStepTwo(cartId);
    res.status(200).json({
    message: `<<${icons.loginSuccess}>> Update Current Cart Process Completed Successfully <<${icons.loginSuccess}>>`,
    currentProductsInCart,
    currentTotalCartPrice
    }); return;
  } 
  catch(ex: unknown){
    console.log(ex)
    res.status(403).send(getGeneralErrorText("Update Current Cart")); return;
  }; 
};

async function deleteFromUserOpenCartHandler(
  req: TypedRequestQuery<{
    currentProductLocationInTable?: any | string | number, 
    cartId: any | string | number,
    emptyCart?: any
  }>, 
  res: Response, 
  next: NextFunction
  ): Promise<void> {
  try{
  let { currentProductLocationInTable, cartId, emptyCart } = req.query;
  if (emptyCart === "true") emptyCart = true;
  if (!emptyCart) emptyCart = false;
  if (!emptyCart && !currentProductLocationInTable) {
    res.status(400).json({
      message: `<<${icons.somethingWentWrong}>> Missing Essential Parameters <<${icons.somethingWentWrong}>>`
  }); return; }
  await deleteFromUserOpenCart(Number(currentProductLocationInTable), cartId, emptyCart);
  const currentProductsInCart: Array<IGetOpenCartDetailsStepThree> = 
  await getCustomerOpenCartCurrentProductsStepThree(cartId);
  const currentTotalCartPrice: string = await getCustomerOpenCartStepTwo(cartId);
    res.status(200).json({
    message: `<<${icons.loginSuccess}>> Delete Items From Current Cart Process Completed Successfully <<${icons.loginSuccess}>>`,
    currentProductsInCart,
    currentTotalCartPrice
    }); return;
  } 
  catch(ex: unknown){
    console.log(ex)
    res.status(403).send(getGeneralErrorText("Delete Items From Current Cart")); return;
  }; 
};


async function checkIfDatesOkForShippingHandler(
  req: Request, 
  res: Response, 
  next: NextFunction
  ): Promise<void> {
  try{
  const finalGoodDatesArray: Array<string> = await checkIfDatesOkForShipping();
    res.status(200).json({
    message: `<<${icons.loginSuccess}>> Fetch Approved Dates For Shipping Process Completed Successfully <<${icons.loginSuccess}>>`,
    finalGoodDatesArray,
    });
  } 
  catch(ex: unknown){
    console.log(ex)
    res.status(403).send(getGeneralErrorText("Fetch Approved Dates For Shipping"));
  }; 
};

export { shoppingRouter };
