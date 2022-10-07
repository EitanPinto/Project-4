import { NextFunction, Request, Response, Router } from "express";
import { Query } from 'express-serve-static-core';
import { ISignToken } from "../auth/signTokenFn";


const validateFrontTokenRouter: Router = Router();


interface TypedRequestQuery<T extends Query> extends Request {
    query: T;
    currentToken: string;
    userData: ISignToken;
  }
validateFrontTokenRouter.get("/", (  
    req: TypedRequestQuery<{frontToken: string | null}>, 
    res: Response, 
    _next: NextFunction
    ) => {
    const { frontToken } = req.query;
    res.status(200).json({ 
        message: "Ok",
        isFrontTokenOk: frontToken === req.currentToken ? true : false,
        role: req.userData.role,
        userName: req.userData.user_name
        });
   return;
});
  


export { validateFrontTokenRouter, TypedRequestQuery }

