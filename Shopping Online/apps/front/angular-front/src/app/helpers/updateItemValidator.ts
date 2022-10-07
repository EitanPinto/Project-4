import * as yup from 'yup';
import { Assign } from 'yup/lib/object';
import { IupdateItemBody } from '../services/admin.service';

export const exeUpdateItemSchema = (): yup.ObjectSchema<Assign<IupdateItemBody, any>> => {
let patternTwoDigisAfterComma = /^\d+(\.\d{0,2})?$/;
const priceValidator = yup.number().test(
    "is-decimal", "The price should be a decimal with maximum of two digits after the comma",
    (val: any) => {
      if (val != undefined) {
        return patternTwoDigisAfterComma.test(val);
      }
      return true;
    }).notRequired();
const updateItemSchemaObj: yup.ObjectSchema<Assign<IupdateItemBody, any>> = yup.object().shape({
    id: yup.number().min(1).required(),
    name: yup.string().max(45).notRequired(),
    categoryId: yup.number().min(1).notRequired(),
    price: priceValidator,
    image: yup.string().nullable().notRequired()
    });
    return updateItemSchemaObj;
};

