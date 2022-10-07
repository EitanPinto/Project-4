import * as yup from 'yup';

export const exeSubmitOrderSchema = () => {
    // const visaCardRegex = /^4[0-9]{12}(?:[0-9]{3})?$/
    const commonTextValidation = yup.string().min(2).max(30).required();
    const submitOrderSchema = yup.object().shape({
        city: commonTextValidation,
        street: commonTextValidation,
        houseNumber: yup.number().min(1).max(1000).required(),
        date: yup.date().required(),
        hour: yup.string().required(),
        creditCard: yup.string().required("Credit Card is required")
        .matches( /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/, 
        "Credit Card Must Be Valid 'MasterCard Or Visa' Number")
        // .test('visaCard', "Credit Card Must Be Valid 'MasterCard Or Visa' Number", function(value: any) {
        //           return visaCardRegex.test(value);
        // })
        });
    return submitOrderSchema;
};


    