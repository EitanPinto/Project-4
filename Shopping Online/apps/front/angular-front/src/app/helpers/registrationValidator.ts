import * as yup from 'yup';
import isEmail from 'validator/lib/isEmail';

export const exeRegistrationSchemaStageOne = () => {
const registrationSchemaObjStageOne = yup.object().shape({
    id: yup.string().min(2).matches(/^[0-9]{1,10}$/).required(),
    userName: yup.string().email("Username must be a valid e-mail address").required("Username is required")
    .test("is-valid", (message) => `${message.path} is invalid`, 
    (value) => value ? isEmail(value) : new yup.ValidationError("Invalid value")),
    password: yup.string().matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/).required(),
    confirmPassword: yup.string().test('passwords-match', 'Passwords must match!', function (value) {
            return this.parent.password === value     
            })
        });
    return registrationSchemaObjStageOne;
};



export const exeRegistrationSchemaStageTwo = () => {
    const commonTextValidation = yup.string().min(2).max(30).required();
    const commonTextValidationName = yup.string().matches(/^[a-zA-Z][a-zA-Z\s]*$/).max(40).required();
    const registrationSchemaObjStageTwo = yup.object().shape({
        city: commonTextValidation,
        street: commonTextValidation,
        houseNumber: yup.number().min(1).max(1000).required(),
        firstName: commonTextValidationName,
        lastName: commonTextValidationName
        });
    return registrationSchemaObjStageTwo;
};
