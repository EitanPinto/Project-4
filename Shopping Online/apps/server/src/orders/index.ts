import { Router, Request, Response, NextFunction } from "express";
import { TypedRequestBody } from "../auth";
import { getCustomerLastOrder, IOrderDB } from "../auth/businessLogic";
import { getGeneralErrorText } from "../helpers/errorTextFns";
import { validateSubmitOrderBody } from "../middlewares/joiValidations";
import { icons } from "../misc/icons";
import { IsubmitOrderBody, uploadNewOrder } from "./businessLogic";

const ordersRouter: Router = Router();


ordersRouter.post(
  "/upload_new_order",
  validateSubmitOrderBody,
  uploadNewOrderHandler
  );

async function uploadNewOrderHandler(
  req: TypedRequestBody<IsubmitOrderBody>, 
  res: Response, 
  next: NextFunction
  ): Promise<any> {
  try{
  await uploadNewOrder(req.body);
  const { customerId } = req.body;
  const newRecentUploadedOrder: IOrderDB = await getCustomerLastOrder(customerId);
  return res.status(200).json({
    message: `<<${icons.loginSuccess}>> Upload New Order Process Completed Successfully <<${icons.loginSuccess}>>`,
    newRecentUploadedOrder
    });
  } 
  catch(ex: unknown){
    console.log(ex)
    return res.status(403).send(getGeneralErrorText("Upload New Order"));
  }; 
};

export { ordersRouter };
