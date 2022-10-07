import { getConnection } from "../db";
import { queryBuilder } from "../helpers/queryBuilderFn";
import { IProductsByCategory } from "../shopping/businessLogic";


interface IcreateItemBody {
  name: string;
  categoryId: number;
  price: string;
  image: string;
};

interface IupdateItemBody {
  id: number;
  name?: string;
  categoryId?: number;
  price?: string;
  image?: string;
};

async function createItem(createItemObj: IcreateItemBody): Promise<void>{
  const query: string = `INSERT INTO project_4_schema.products (name, category_id, price, image) VALUES (?,?,?,?)`;
  await getConnection().execute(query, [...Object.values(createItemObj)]);
};

async function getItemById(productId: number): Promise<IProductsByCategory>{
  const query: string = `select * from project_4_schema.products where id = ?`;
  const result: Array<any> = await getConnection().execute(query, [productId]);
  const resultSecond: Array<IProductsByCategory> = result[0];
  const resultThree: IProductsByCategory = resultSecond[0];
  return resultThree;
};

async function updateItem(reqBody: IupdateItemBody): Promise<void>{
//item id mandatory 
// in this function after I have at least one param to update
const { id } = reqBody;
const arrBodyKeys: Array<string> = Object.keys(reqBody);
const newBody: IupdateItemBody | {} = arrBodyKeys.reduce((accum: {}, key: string) => {
  if (Boolean(reqBody[key])) accum[key] = reqBody[key];
   return accum;
 }, {});
const paramsArr: Array<any> = Object.values(newBody);
paramsArr.splice(0, 1);
paramsArr.push(id);
const query: string = queryBuilder(reqBody);
await getConnection().execute(query, paramsArr);
};

export{
  IcreateItemBody,
  IupdateItemBody,
  getItemById,
  updateItem,
  createItem
}

