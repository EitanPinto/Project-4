import { Router, Request, Response, NextFunction } from "express";
import { IupdateItemBody } from "../admin/businessLogic";
import { IRegisterNewUserReqBodyLevelTwo, TypedRequestBody } from "../auth";
import { icons } from "../misc/icons";

const zeroErrorText = "Parameter Must Be Greater Than 0";

function validateBodyParamsForRegisterLevelOne(
    req: TypedRequestBody<{id: number} | IRegisterNewUserReqBodyLevelTwo>, 
    res: Response, 
    next: NextFunction
    ): void {
    const { id } = req.body
    console.log(typeof(id), id)
    if (!id){            // checks if 0 / NaN / ""
    res.status(422).json({
    Error_Message: `<<${icons.somethingWentWrong}>> Missing Essential Parameters ${id === 0? `- ${zeroErrorText}` : ""} <<${icons.somethingWentWrong}>>`
    }); return; }
    else if (typeof(id) !== typeof(Number(id))) {    // checks if type is different than number
    res.status(400).json({Error_Message: `<<${icons.warning}>> No Match. Customer ID Must Be a Number. <<${icons.warning}>>`}); return; }
    next(); 
};


export { 
    validateBodyParamsForRegisterLevelOne, 
    zeroErrorText
};


