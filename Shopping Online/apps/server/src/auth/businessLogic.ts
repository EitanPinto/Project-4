import { IRegisterNewUserReqBodyLevelTwo } from ".";
import { getConnection } from "../db";

interface IUserDB {
id: number;
first_name: string;
last_name: string;
user_name: string;
password: string;
city: string | null;
street: string | null;
house_number: number | null;
role: string;
created_at: object;
};

interface IOrderDB {
id: number;
customer_id: number;
cart_id: number;
final_price: string;
ship_city: string;
ship_street: string;
ship_house_number: number;
ship_date_time: object;
order_submitted_at: object;
last_4_digits_credit_card: number;
};

interface IGetOpenCartDetailsStepOne {
  cart_id: number;
  created_at: object;
};

interface IGetOpenCartDetailsStepThree {
  id: number;
  name: string;
  category_id: number;
  price: string;
  image: string;
  quantity: number;
  total_price: string;
  cart_id: number;
  specific_row_location_in_cart_products_table: number;
};

async function checkIfUserIdExistsInDB(id: number): Promise<IUserDB | undefined> {
  const query: string = `SELECT * FROM customers WHERE id = ?`;
  const [result]: Array<IUserDB> | [] = await getConnection().execute(query, [id]);
  const user: IUserDB | undefined = result[0] 
  return user;
};

async function checkIfUserExistsInDB(userName: string, login: boolean = false): Promise<IUserDB | undefined> {
  const queryTextUserLogin: string = "order by customers.created_at DESC limit 1"
  const query: string = `SELECT * FROM customers WHERE user_name = ? ${ login ? queryTextUserLogin : "" }`;
  console.log(query);
  const [result]: Array<IUserDB> | [] = await getConnection().execute(query, [userName]);
  return result[0];
};

async function insertNewUser(newUserObj: IRegisterNewUserReqBodyLevelTwo): Promise<void> {
  const { id, userName, password, city, street, houseNumber, firstName, lastName } = newUserObj;
  const query: string = `INSERT INTO customers (id, user_name, password, city, street, house_number, first_name, last_name) 
  VALUES (?,?,?,?,?,?,?,?);`;
  const [dbSuccessObj]: Array<any> = await getConnection()
  .execute(query, [id, userName, password, city, street, houseNumber, firstName, lastName]);
};

async function getNewUser(userName: string): Promise<IUserDB> {
const query: string = `select * from customers where user_name = ?`;
const [result]: Array<IUserDB> = await getConnection().execute(query, [userName]);
return result[0];
};

async function getNumberOfAllCartsPerCustomer(id: number): Promise<number>{
  const query: string = "SELECT count(*) as number_of_carts_per_customer FROM project_4_schema.carts where customer_id = ?";
  const [result]: Array<{number_of_carts_per_customer: number}> = await getConnection().execute(query, [id]);
  return result[0].number_of_carts_per_customer;
};

async function getNumberOfAllOrdersPerCustomer(id: number): Promise<number>{
  const query: string = "SELECT count(*) as number_of_orders_per_customer FROM project_4_schema.orders where customer_id = ?";
  const [result]: Array<{number_of_orders_per_customer: number}> = await getConnection().execute(query, [id]);
  return result[0].number_of_orders_per_customer;
};

async function getCustomerLastOrder(id: number): Promise<IOrderDB>{
  const query: string = "SELECT * FROM project_4_schema.orders where orders.customer_id = ? order by orders.order_submitted_at desc limit 1";
  const [result]: Array<IOrderDB> = await getConnection().execute(query, [id]);
  return result[0];
};

async function getCustomerOpenCartStepOne(id: number): Promise<IGetOpenCartDetailsStepOne>{
  const query: string = `select a.id as cart_id, a.created_at from (SELECT carts.id, carts.customer_id, created_at FROM project_4_schema.carts 
    left JOIN project_4_schema.orders ON project_4_schema.carts.id = project_4_schema.orders.cart_id 
    WHERE project_4_schema.orders.cart_id IS NULL) as a where a.customer_id = ?`;
  const [result]: Array<IGetOpenCartDetailsStepOne> | [] = await getConnection().execute(query, [id]);
  return result[0];
};

async function getCustomerOpenCartStepTwo(cartId: number): Promise<string>{
  let currentTotalPrice: undefined | string;
  const query: string = `SELECT SUM(cart_products.total_price) as current_total_price FROM cart_products WHERE cart_products.cart_id = ?`;
  const [result]: Array<{current_total_price: string}> = await getConnection().execute(query, [cartId]);
  result[0].current_total_price === null ? currentTotalPrice = "0.00" : currentTotalPrice = result[0].current_total_price
  return currentTotalPrice;
};

async function getCustomerOpenCartCurrentProductsStepThree(cartId: number): Promise<Array<IGetOpenCartDetailsStepThree>>{
  const query: string = `select products.id, name, category_id, price, image, quantity, total_price, cart_id, cart_products.id as 
  specific_row_location_in_cart_products_table from products join cart_products on 
  products.id = cart_products.product_id where cart_products.cart_id = ?`;
  const result: Array<any> = await getConnection().execute(query, [cartId]);
  const finalResult: Array<IGetOpenCartDetailsStepThree> = result[0];
  return finalResult;
};

export {
  getCustomerOpenCartCurrentProductsStepThree,
  getNumberOfAllOrdersPerCustomer,
  getNumberOfAllCartsPerCustomer,
  IGetOpenCartDetailsStepThree,
  IGetOpenCartDetailsStepOne,
  getCustomerOpenCartStepOne,
  getCustomerOpenCartStepTwo,
  checkIfUserIdExistsInDB,
  checkIfUserExistsInDB,
  getCustomerLastOrder,
  insertNewUser,
  getNewUser,
  IOrderDB,
  IUserDB
};