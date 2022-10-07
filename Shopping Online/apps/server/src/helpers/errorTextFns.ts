import { icons } from "../misc/icons"

const getGeneralErrorText = (text: string): string => {
    return `<<${icons.somethingWentWrong}>> Something Went Wrong - ${text} Process Failed <<${icons.somethingWentWrong}>>`
};

const getUnauthorizedErrorText = (): string => {
    return `<<${icons.notAuthorized}>> You Are Not Authrized To Be Here <<${icons.notAuthorized}>>`
};

export { 
    getGeneralErrorText,
    getUnauthorizedErrorText
};