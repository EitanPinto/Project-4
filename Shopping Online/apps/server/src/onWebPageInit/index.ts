import { Router, Request, Response, NextFunction } from "express";
import { getGeneralErrorText } from "../helpers/errorTextFns";
import { icons } from "../misc/icons";
import { getNumberOfAllOrders, getNumberOfAllProducts } from "./businessLogic";

const onInitWebPageRouter: Router = Router();


onInitWebPageRouter.get(
  "/orders", 
  getNumberOfAllOrdersHandler
  );

onInitWebPageRouter.get(
  "/products", 
  getNumberOfAllProductsHandler
  );
  
async function getNumberOfAllOrdersHandler(
  req: Request, 
  res: Response, 
  next: NextFunction
  ): Promise<void> {
try {
const totalNumberOfOrders: number = await getNumberOfAllOrders();
res.status(200).json({
    totalNumberOfOrders,
    message: `<<${icons.loginSuccess}>> Fetching All Orders Process Completed Successfully <<${icons.loginSuccess}>>`
}); return; 
} catch(ex: unknown){
  console.log(ex)
  res.status(403).send(getGeneralErrorText("Fetching All Orders")); return;
};
};

async function getNumberOfAllProductsHandler(
  req: Request, 
  res: Response, 
  next: NextFunction
  ): Promise<void> {
try {
const totalNumberOfProducts: number = await getNumberOfAllProducts();
res.status(200).json({
    totalNumberOfProducts,
    message: `<<${icons.loginSuccess}>> Fetching All Products Process Completed Successfully <<${icons.loginSuccess}>>`
}); return;
} catch(ex: unknown){
  console.log(ex)
  res.status(403).send(getGeneralErrorText("Fetching All Products")); return;
};
};


export { onInitWebPageRouter };

