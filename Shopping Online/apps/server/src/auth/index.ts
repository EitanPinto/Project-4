import { validateLoginBody, validateRegistrationLevelTwoBody } from "../middlewares/joiValidations";
import { Router, Request, Response, NextFunction } from "express";
import { validateBodyParamsForRegisterLevelOne } from "../middlewares/generalValidations";
import { getGeneralErrorText } from "../helpers/errorTextFns";
import { isPasswordMatch } from "./validations";
import { ISignToken, signToken } from "./signTokenFn";
import { icons } from "../misc/icons";
import { 
  getCustomerOpenCartCurrentProductsStepThree,
  getNumberOfAllOrdersPerCustomer,
  getNumberOfAllCartsPerCustomer,
  IGetOpenCartDetailsStepThree,
  getCustomerOpenCartStepOne,
  IGetOpenCartDetailsStepOne,
  getCustomerOpenCartStepTwo,
  checkIfUserIdExistsInDB,
  checkIfUserExistsInDB, 
  getCustomerLastOrder,
  insertNewUser, 
  getNewUser, 
  IOrderDB,
  IUserDB
} from "./businessLogic";

const authRouter: Router = Router();

interface TypedRequestBody<T> extends Request {
  body: T;
  userData?: ISignToken;
};

interface IUserLoginReqBody {
  userName: string;
  password?: string;
  verifiedToken?: boolean;
};

interface IRegisterNewUserReqBodyLevelTwo {
  id?: number;
  userName: string;
  password: string;
  confirmPassword: string;
  city: string;
  street: string;
  houseNumber: number;
  firstName: string;
  lastName: string;
};

authRouter.post(
  "/login", 
  validateLoginBody,
  loginHandler
  );
  

authRouter.post(
  "/registerLevelOne",
  validateBodyParamsForRegisterLevelOne, 
  registerLevelOneHandler
  );

authRouter.post(
  "/registerLevelTwo", 
  validateBodyParamsForRegisterLevelOne,
  validateRegistrationLevelTwoBody, 
  registerLevelTwoHandler
  );


async function loginHandler(
  req: TypedRequestBody<IUserLoginReqBody>, 
  res: Response, 
  next: NextFunction
  ): Promise<void> {
  const { userName, password, verifiedToken } = req?.body;
  try {
  const currentUser: IUserDB | undefined = await checkIfUserExistsInDB(userName, true);
  if (!currentUser) {
    res.status(404).send(`<<${icons.notFound}>> User Not Found <<${icons.notFound}>>`);
    return;
};
if(!verifiedToken){
  if (!isPasswordMatch(currentUser, password)) { 
    res.status(401).send(`
    <<${icons.notAuthorized}>> User Is Not Authorized <<${icons.notAuthorized}>>
    `);
    return;
  };
}
  const { id, first_name, last_name, user_name, city, street, house_number, role } = currentUser;
  const numberOfCartsPercustomer: number = await getNumberOfAllCartsPerCustomer(id);
  const numberOfOrdersPercustomer: number = await getNumberOfAllOrdersPerCustomer(id);
  let currentCartId: number | undefined;
  let openCartExist: boolean = false;
  let openCartNotExist: boolean = false;
  let isNewCustomer: boolean = false;
  let customerLastOrder: undefined | IOrderDB;
  let openCartDetailsStepOne: undefined | IGetOpenCartDetailsStepOne;
  let currentTotalPrice: undefined | string;
  let currentProductsInCart: undefined | Array<IGetOpenCartDetailsStepThree>;
  if (numberOfCartsPercustomer === 0) isNewCustomer = true;
  if (numberOfCartsPercustomer === numberOfOrdersPercustomer) {
  customerLastOrder = await getCustomerLastOrder(id);
  openCartNotExist = true;
  };
  if (numberOfCartsPercustomer !== numberOfOrdersPercustomer) {
  openCartDetailsStepOne = await getCustomerOpenCartStepOne(id);
  currentCartId = openCartDetailsStepOne.cart_id;
  currentTotalPrice = await getCustomerOpenCartStepTwo(currentCartId);
  currentProductsInCart = await getCustomerOpenCartCurrentProductsStepThree(currentCartId);
  openCartExist = true;
  };
  const _processCustomerLoginOptions = (
    openCartExist: boolean, 
    openCartNotExist: boolean, 
    isNewCustomer: boolean) =>{
  if (isNewCustomer) return { isNewCustomer };
  if (openCartNotExist) return { customerLastOrder, openCartNotExist };
  if (openCartExist) return { 
    cartCreatedAt: openCartDetailsStepOne.created_at, 
    currentTotalPrice, 
    currentProductsInCart, 
    openCartExist,
    currentCartId
  };
  };
  const token: string = signToken({ id, first_name, last_name, user_name, role });

  res.status(200).json({ 
    userId: id,
    userName,
    userResidence: { city, street, house_number }, 
    message: `<<${icons.loginSuccess}>> Login Success <<${icons.loginSuccess}>>`,
    isLoggedIn: true, 
    token,
    role,
    ..._processCustomerLoginOptions(
      openCartExist, 
      openCartNotExist, 
      isNewCustomer
      )
  }); return;
} catch(ex: unknown){
  console.log(ex)
  res.status(403).send(getGeneralErrorText("Login")); return;
};
};

async function registerLevelOneHandler(
  req: TypedRequestBody<{id: number}>, 
  res: Response, 
  next: NextFunction
  ): Promise<void> {
  const { id } = req.body;
  try{
  const currentUser: IUserDB | undefined = await checkIfUserIdExistsInDB(id);
  if (currentUser) {
    res.status(409).send(`<<${icons.conflict}>> Submitted Customer ID Already Exists In The System <<${icons.conflict}>>`); 
    return; }
    res.status(200).json({
    message: `<<${icons.loginSuccess}>> Submitted Customer ID Was Not Found In The System <<${icons.loginSuccess}>>`
    }); return;
  } 
  catch(ex: unknown){
    console.log(ex)
    res.status(403).send(getGeneralErrorText("Registration - Level One")); return;
  }; 
};

async function registerLevelTwoHandler(
  req: TypedRequestBody<IRegisterNewUserReqBodyLevelTwo>, 
  res: Response, 
  next: NextFunction
  ): Promise<void> {
  const { userName } = req.body;
  try{
  const currentUser: IUserDB | undefined = await checkIfUserExistsInDB(userName);
  if (currentUser) {res.status(409).send(`<<${icons.conflict}>> User Already Exist <<${icons.conflict}>>`); return;}
  await insertNewUser(req.body);
  const newUser: IUserDB = await getNewUser(userName);
  res.status(200).json({
   message: `<<${icons.registerSuccess}>> New User: ${newUser.user_name} Registered successfully <<${icons.registerSuccess}>>`
  }); return;
  } 
  catch(ex: unknown){
    console.log(ex)
    res.status(403).send(getGeneralErrorText("Registration - Level Two")); return;
  };
};


export {
  IRegisterNewUserReqBodyLevelTwo,
  IUserLoginReqBody,
  TypedRequestBody,
  authRouter
};

