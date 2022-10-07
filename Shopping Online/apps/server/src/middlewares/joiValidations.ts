import Joi from "joi";
import { Response, NextFunction } from "express";
import { TypedRequestQuery } from "../validateFrontToken";
import { IsubmitOrderBody } from "../orders/businessLogic";
import { IcreateItemBody, IupdateItemBody } from "../admin/businessLogic";
import { 
  IRegisterNewUserReqBodyLevelTwo, 
  IUserLoginReqBody, 
  TypedRequestBody 
} from "../auth";

interface IupdateCartBody {
  productId: number;
  quantity: number;
  cartId: number;
};

function exeLoginSchema(): Joi.ObjectSchema<IUserLoginReqBody> {
const loginSchema: Joi.ObjectSchema<IUserLoginReqBody> = Joi.object({
  userName: Joi.string().min(1).required(),
  password: Joi.string().min(1),
  verifiedToken: Joi.boolean()
});
return loginSchema;
};

function validateLoginBody(
  req: TypedRequestBody<IUserLoginReqBody>, 
  res: Response, 
  next: NextFunction
  ): any {
  const { error } = exeLoginSchema().validate(req.body);
  if (error) return next(new Error(error.message));
  next();
};

function exeRegistrationSchema(): Joi.ObjectSchema<IRegisterNewUserReqBodyLevelTwo> {
const commonTextValidation: Joi.StringSchema = Joi.string().min(2).max(30).required();
const commonTextValidationName = Joi.string().regex(/^[a-zA-Z][a-zA-Z\s]*$/).max(40).required();
const registrationSchema: Joi.ObjectSchema<IRegisterNewUserReqBodyLevelTwo>= Joi.object({
  userName: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().regex(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/).required(),
  confirmPassword: Joi.ref('password'),
  city: commonTextValidation,
  street: commonTextValidation,
  houseNumber: Joi.number().min(1).max(1000).required(),
  firstName: commonTextValidationName,
  lastName: commonTextValidationName
});
return registrationSchema;
};

function validateRegistrationLevelTwoBody(
  req: TypedRequestBody<IRegisterNewUserReqBodyLevelTwo>, 
  res: Response, 
  next: NextFunction
  ): any {
  const fullBody = req.body;
  const {id, ...rest} = fullBody;
  const { error } = exeRegistrationSchema().validate(rest);
  if (error) return next(new Error(error.message));
  next();
};

function exeSearchBarSchema(): Joi.ObjectSchema<{searchedProduct: string}> {
  const searchBarSchema: Joi.ObjectSchema<{searchedProduct: string}> = Joi.object({
    searchedProduct: Joi.string().regex(/^[a-zA-Z0-9\s]+$/)
  });
  return searchBarSchema;
};
  
function validateSearchBarQuery(
  req: TypedRequestQuery<{searchedProduct: string, page: string}>, 
  res: Response, 
  next: NextFunction
  ): any {
  const allQueryParamsObj = req.query;
  const { searchedProduct } = allQueryParamsObj;
  const newObjToValidate = { searchedProduct }
  const { error } = exeSearchBarSchema().validate(newObjToValidate);
  if (error) return next(new Error(error.message));
  next();
};
 
function validateOpenNewCartBody(
  req: TypedRequestBody<{userId: number}>, 
  res: Response, 
  next: NextFunction
  ): any {
  const { error } = ((): Joi.ObjectSchema<{userId: number}> => {
    const searchBarSchema: Joi.ObjectSchema<{userId: number}> = Joi.object({
      userId: Joi.number().required()
    });
    return searchBarSchema;
  })().validate(req.body);
  if (error) return next(new Error(error.message));
  next();
};

function validateParamsForCartUpdate(
  req: TypedRequestBody<IupdateCartBody>, 
  res: Response, 
  next: NextFunction
  ): any {
  const commonUpdateCartValidation: Joi.NumberSchema = Joi.number().required();
  const { error } = ((): Joi.ObjectSchema<IupdateCartBody> => {
    const updateCartSchema: Joi.ObjectSchema<IupdateCartBody> = Joi.object({
      productId: commonUpdateCartValidation,
      quantity: commonUpdateCartValidation,
      cartId: commonUpdateCartValidation,
    });
    return updateCartSchema;
  })().validate(req.body);
  if (error) return next(new Error(error.message));
  next();
};

function validateParamsForDeleteActionFromOpenCart(
  req: TypedRequestQuery<{
    currentProductLocationInTable?: any | number | string, 
    cartId: any | number | string,
    emptyCart?: any
  }>, 
  res: Response, 
  next: NextFunction
  ): any {
  let { cartId } = req.query;
  cartId = Number(cartId);
  const { error } = ((): Joi.ObjectSchema<{cartId: number}> => {
    const deleteFromCartSchema: Joi.ObjectSchema<{cartId: number}> = Joi.object({
      cartId: Joi.number().required()
    });
    return deleteFromCartSchema;
  })().validate({cartId});
  if (error) return next(new Error(error.message));
  next();
};

function exeSubmitOrderSchema(): Joi.ObjectSchema<IsubmitOrderBody> {
  const commonTextValidation: Joi.StringSchema = Joi.string().min(2).max(30).required();
  const submitOrderSchema: Joi.ObjectSchema<IsubmitOrderBody> = Joi.object({
    customerId: Joi.number().min(111111).required(),
    cartId: Joi.number().min(1).required(),
    finalPrice: Joi.string().min(1).max(50).required(),
    city: commonTextValidation,
    street: commonTextValidation,
    houseNumber: Joi.number().min(1).max(1000).required(),
    dateTime: Joi.string().min(2).max(100).required(),
    last4DigitsCc: Joi.number().max(99999999999999999999999999).required()
  });
  return submitOrderSchema;
  };
  
  function validateSubmitOrderBody(
    req: TypedRequestBody<IsubmitOrderBody>, 
    res: Response, 
    next: NextFunction
    ): any {
      console.log(req.body, typeof(req.body.customerId))

    const { error } = exeSubmitOrderSchema().validate(req.body);
    if (error) return next(new Error(error.message));
    next();
  };


function exeCreateItemSchema(): Joi.ObjectSchema<IcreateItemBody>{
  return Joi.object({
      name: Joi.string().min(2).max(45).required(),
      categoryId: Joi.number().min(1).required(),
      price: Joi.string().max(20).required(),
      image: Joi.string().allow("").allow(null)
  });
};

function validateCreateItemBody(
  req: TypedRequestBody<IcreateItemBody>, 
  res: Response, 
  next: NextFunction
  ): any {
  const { error } = exeCreateItemSchema().validate(req.body);
  if (error) return next(new Error(error.message));
  next();
};


function validateParamsGetProductById(
  req: TypedRequestQuery<{ productId: any | number | string }>, 
  res: Response, 
  next: NextFunction
  ): any {
  let { productId } = req.query;
  productId  = Number(productId);
  const { error } = ((): Joi.ObjectSchema<{productId: number}> => {
    return Joi.object({
      productId: Joi.number().min(1).required()
    });
  })().validate({productId});
  if (error) return next(new Error(error.message));
  next();
};

function exeUpdateItemSchema(): Joi.ObjectSchema<IupdateItemBody>{
  return Joi.object({
    id: Joi.number().min(1),
    name: Joi.string().allow("").max(45),
    categoryId: Joi.number().min(1),
    price: Joi.string().allow("").max(20),
    image: Joi.string().allow(""),
  });
};

function validateUpdateItemBody(
  req: TypedRequestBody<IupdateItemBody>, 
  res: Response, 
  next: NextFunction
  ): void {
  const { error } = exeUpdateItemSchema().validate(req.body);
  if (error) return next(new Error(error.message));
  next();
};



export {
  validateParamsForDeleteActionFromOpenCart,
  validateRegistrationLevelTwoBody,
  validateParamsGetProductById,
  validateParamsForCartUpdate,
  validateSubmitOrderBody,
  validateOpenNewCartBody,
  validateUpdateItemBody,
  validateSearchBarQuery,
  validateCreateItemBody,
  validateLoginBody,
  IupdateCartBody
}