import * as yup from 'yup';

export const exeSearchBarSchema = () => {
const searchBarSchema = yup.object().shape({
    searchedProduct: yup.string().matches(/^[a-zA-Z0-9\s]+$/)
        });
    return searchBarSchema;
};
