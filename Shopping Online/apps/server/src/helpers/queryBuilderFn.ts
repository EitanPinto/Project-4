import { IupdateItemBody } from "../admin/businessLogic";

const queryBuilder = (reqBody: IupdateItemBody): string => {
    const { name, categoryId, price, image } = reqBody;
    const query: string = `UPDATE project_4_schema.products SET
    ${name ? `name = ? ` : ""}
    ${name && (categoryId || price || image)? ", " : ""} 
    ${categoryId ? `category_id = ?` : ""}
    ${categoryId &&(price || image)? ", " : ""} 
    ${price ? `price = ?` : ""}
    ${price && image? ", " : ""} 
    ${image ? `image = ? ` : ""}
    where id = ?`
    return query;
};

export { queryBuilder };