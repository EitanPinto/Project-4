import * as yup from 'yup';
import { Assign } from 'yup/lib/object';
import { ICreateItemBody } from '../services/admin.service';

export const exeCreateItemSchema = (): yup.ObjectSchema<Assign<ICreateItemBody, any>> => {
    let patternTwoDigisAfterComma = /^\d+(\.\d{0,2})?$/;
const priceValidator = yup.number().test(
    "is-decimal", "The price should be a decimal with maximum of two digits after the comma",
    (val: any) => {
      if (val != undefined) {
        return patternTwoDigisAfterComma.test(val);
      }
      return true;
    }).min(0.1).required();
const createItemSchemaObj = yup.object().shape({
    name: yup.string().min(2).max(45).required(),
    categoryId: yup.number().min(1).required(),
    price: priceValidator,
    image: yup.string().nullable().notRequired()
    });
    return createItemSchemaObj;
};

