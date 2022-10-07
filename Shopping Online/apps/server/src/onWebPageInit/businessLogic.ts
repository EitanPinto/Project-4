import { getConnection } from "../db";

async function getNumberOfAllOrders(): Promise<number> {
const query: string = "select count(*) as total_number_of_orders from orders";
const [result]: Array<{total_number_of_orders: number}> = await getConnection().execute(query);
return result[0].total_number_of_orders;
};

async function getNumberOfAllProducts(): Promise<number> {
const query: string = "SELECT count(*) as total_number_of_products FROM project_4_schema.products";
const [result]: Array<{total_number_of_products: number}> = await getConnection().execute(query);
return result[0].total_number_of_products;
};


export { getNumberOfAllOrders, getNumberOfAllProducts};