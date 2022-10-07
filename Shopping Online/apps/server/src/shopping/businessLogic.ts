import { getConnection } from "../db";
import { IupdateCartBody } from "../middlewares/joiValidations";

interface IproductCategories {
    id: number;
    name: string;
};

async function getProductCategories(): Promise<Array<IproductCategories>> {
const query: string = "SELECT * FROM project_4_schema.product_categories;";
const result: Array<any> = await getConnection().execute(query);
const productCategories: Array<IproductCategories> = result[0]
return productCategories
};

interface IProductsByCategory {
    id: number;
    name: string;
    category_id: number;
    price: string;
    image: string;
};

interface IRecentlyOpenedCart {
    id: number;
    customer_id: number;
    created_at: object;
}

async function getProductsByCategory(
    categoryId: number, 
    page: number
    ): Promise<[] | Array<IProductsByCategory>> {
const query: string = "select * from products where category_id = ? order by name limit 10 offset ?";
let currentPage: number;
!page ? currentPage = 0 : currentPage = (page - 1) * 10;
const result: Array<any> = await getConnection().execute(query, [categoryId, `${currentPage}`]);
const finalResult: [] | Array<IProductsByCategory> = result[0];
return finalResult;
};

async function getSearchedProductsByFreeText(
    searchedProduct: string, 
    page: number): Promise<Array<IProductsByCategory>> {
const query: string = `select * from products WHERE name LIKE ? order by name limit 10 offset ?`;
let currentPage: number;
!page ? currentPage = 0 : currentPage = (page - 1) * 10;
const result: Array<any> = await getConnection().execute(query, [`%${searchedProduct}%`, `${currentPage}`]);
const products: Array<IProductsByCategory> = result[0]
console.log(products)
return products;
};

async function openNewCartForUser(userId: number): Promise<void>{
    const query: string = `INSERT INTO project_4_schema.carts (customer_id) VALUES (?)`;
    await getConnection().execute(query, [userId]);
};


async function getRecentlyOpenedCart(userId: number): Promise<IRecentlyOpenedCart>{
    const query: string = `select * from project_4_schema.carts  where customer_id = ? order by created_at desc limit 1`;
    const [result]: Array<any> = await getConnection().execute(query, [userId]);
    const recentlyOpenedCart: IRecentlyOpenedCart = result[0];
    return recentlyOpenedCart;
};

async function getCurrentProductPrice(productId: number): Promise<string>{
    let currentProductPrice: undefined | string;
    const query: string = `select price from products where id = ?`;
    const result: Array<any> = await getConnection().execute(query, [productId]);
    const middleResult:Array<{ price: string }> = result[0];
    const finalResult: { price: string } = middleResult[0];
    if('price' in finalResult) currentProductPrice = finalResult["price"] 
    return currentProductPrice;
};

async function updateUserOpenCart(updateCartBody: IupdateCartBody, currentProductPrice: string): Promise<void>{
    const { productId, quantity, cartId } = updateCartBody;
    const query: string = `INSERT INTO project_4_schema.cart_products (product_id, quantity, total_price, cart_id) 
    VALUES (?, ?, ?, ?) `;
    const totalPrice = quantity * Number(currentProductPrice);
    await getConnection().execute(query, [productId, quantity, totalPrice, cartId]);
};
 
async function deleteFromUserOpenCart(
    currentProductLocationInTable: null | undefined | number, 
    cartId: number,
    emptyCart: boolean
    ): Promise<void>{
    let query: undefined | string;
    let paramsArr: undefined | Array<number>;
    if (!emptyCart) {
        query = `DELETE FROM cart_products WHERE id = ?`;
        paramsArr = [currentProductLocationInTable];
    }
    if (emptyCart) {
        query = `DELETE FROM cart_products WHERE cart_id = ?`;
        paramsArr = [cartId];
    }
    await getConnection().execute(query, paramsArr);
};

async function checkIfDatesOkForShipping(): Promise<any>{
    const _getAllDaysInMonth = (year: number, month: number) => {
        const date = new Date(year, month, 1);
        const dates = [];
        while (date.getMonth() === month) {
          dates.push(new Date(date));
          date.setDate(date.getDate() + 1);
        }
        return dates;
      }
    const now = new Date();
    const allDaysOfCurrentMonth: Array<object> = _getAllDaysInMonth(now.getFullYear(), now.getMonth());
    const allDaysOfCurrentMonthSliced: Array<string> = allDaysOfCurrentMonth.map(
        (dateObj) => (dateObj as any).toJSON().slice(0, 10)); 
    const query: string = `SELECT IF(COUNT(*) > 3 , 1, 0) FROM orders WHERE project_4_schema.orders.ship_date_time LIKE ?`;
    const goodDatesArray: Array<string | undefined> = await Promise.all(allDaysOfCurrentMonthSliced.map(async(day: string) => {
        const result: Array<any> = await getConnection().execute(query, [`%${day}%`]);
        const resultTwo: Array<{'IF(COUNT(*) > 3 , 1, 0)': number }> = result[0];
        const resultThree: {'IF(COUNT(*) > 3 , 1, 0)': number } = resultTwo[0];
        if(resultThree["IF(COUNT(*) > 3 , 1, 0)"] === 0) return day; 
    }))
    const finalGoodDatesArray: Array<string> = goodDatesArray.filter((dateString: string | undefined) => dateString)
    console.log(finalGoodDatesArray)
    return finalGoodDatesArray;
};


export { 
    getSearchedProductsByFreeText,
    checkIfDatesOkForShipping,
    getCurrentProductPrice,
    deleteFromUserOpenCart,
    getRecentlyOpenedCart,
    getProductsByCategory,
    getProductCategories, 
    IProductsByCategory,
    IRecentlyOpenedCart,
    IproductCategories,
    updateUserOpenCart,
    openNewCartForUser
};

