import { Router, Response, NextFunction } from "express";
import { TypedRequestBody } from "../auth";
import { getGeneralErrorText, getUnauthorizedErrorText, } from "../helpers/errorTextFns";
import { zeroErrorText} from "../middlewares/generalValidations";
import { icons } from "../misc/icons";
import { IProductsByCategory } from "../shopping/businessLogic";
import { TypedRequestQuery } from "../validateFrontToken";
import { 
  validateCreateItemBody, 
  validateParamsGetProductById, 
  validateUpdateItemBody 
} from "../middlewares/joiValidations";
import { 
  createItem, 
  getItemById, 
  IcreateItemBody, 
  IupdateItemBody, 
  updateItem 
} from "./businessLogic";


const adminRouter: Router = Router();

adminRouter.post(
  "/add_item",
  validateCreateItemBody,
  createItemHandler
  );

adminRouter.get(
  "/get_item_by_id",
  validateParamsGetProductById,
  getItemByIdHandler
  );

adminRouter.put(
  "/update_item",
  validateUpdateItemBody,
  updateItemHandler
  );
  
const adminTitle = "admin";

async function createItemHandler(
  req: TypedRequestBody<IcreateItemBody>, 
  res: Response,
  next: NextFunction
  ): Promise<void> {
  const { role } = req.userData;
  const { name } = req.body;
  console.log(req.body)
  if (role !== adminTitle) {
    res.status(401).json({ error_message: getUnauthorizedErrorText() });
    return;
  };
  try {
    await createItem(req.body);
    res.status(200).json({
  success_message: `<<${icons.registerSuccess}>> New Item: ${name}, Was Uploaded To DB Successfully <<${icons.registerSuccess}>>`
  }); return;
  }
  catch(ex: unknown){
    res.status(403).json({
    error_message: `<<${icons.somethingWentWrong}>> New Item Failed To Be Created <<${icons.somethingWentWrong}>>`
  }); return;
};
};

async function getItemByIdHandler(
  req: TypedRequestQuery<{ productId: any }>, 
  res: Response, 
  next: NextFunction
  ): Promise<void>{
  try{
  const { productId } = req.query;
  const selectedProduct: IProductsByCategory = await getItemById(productId)
    res.status(200).json({ 
    message: `<<${icons.loginSuccess}>> Selected Product: ID No. ${selectedProduct.id} - Fetched Successfully <<${icons.loginSuccess}>>`,
    selectedProduct
    }); return;
  } catch(ex: unknown){
    res.status(403).json({ error_message: getGeneralErrorText("Search Selected Product In DB")}); return;
  };
};

async function updateItemHandler(
  req: TypedRequestBody<IupdateItemBody>, 
  res: Response, 
  next: NextFunction
  ): Promise<void> {
  const { role } = req.userData;
  const { id, name, categoryId, price, image } = req.body;
  if (role !== adminTitle) {
    res.status(401).json({ error_message: getUnauthorizedErrorText() });
    return;
  };
    //item id mandatory 
  if (!id){            // checks if 0 / NaN / ""
  res.status(422).json({
  error_message: `<<${icons.somethingWentWrong}>> Missing Essential Parameters ${id === 0? `- ${zeroErrorText}` : ""} <<${icons.somethingWentWrong}>>`
  }); return; }
  else if (typeof(id) !== typeof(Number(id))) {    // checks if type is different than number
  res.status(400).json({Error_Message: `<<${icons.warning}>> No Match. Item ID Must Be a Number. <<${icons.warning}>>`}); return; }
  const bodyValuesArrIncId: Array<any> = Object.values(req.body)
  const checkExistingParamsArr: Array<any> = bodyValuesArrIncId.filter(p=> p)
  console.log(checkExistingParamsArr," checkExistingParamsArr")
  if (checkExistingParamsArr.length <= 1 || !name && !categoryId && !price && !image) {
  res.status(400).json({
    error_message: `<<${icons.warning}>> Missing Essential Parameters - Should have Sent At Least One Parameter To Update <<${icons.warning}>>`}); 
    return; }
  try{
    await updateItem(req.body);
    res.status(200).json({
    success_message: `<<${icons.loginSuccess}>> Update Item No. ${id} Process Completed Successfully <<${icons.loginSuccess}>>`,
    }); return;
  } 
  catch(ex: unknown){
    res.status(403).json({ Error_Message: getGeneralErrorText("Update Item") }); return;
  }; 
};


export{ adminRouter };