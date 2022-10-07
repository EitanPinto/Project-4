import * as yup from 'yup';

export const exeLoginSchema = () => {
const loginSchemaObj = yup.object().shape({
  userName: yup.string().min(4).required(),
  password: yup.string().min(4).required()
});
return loginSchemaObj;
};

