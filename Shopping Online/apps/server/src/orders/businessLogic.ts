import { getConnection } from "../db";


interface IsubmitOrderBody {
    customerId: number;
    cartId: number;
    finalPrice: string;
    city: string;
    street: string;
    houseNumber: number;
    dateTime: string;
    last4DigitsCc: number;
};

async function uploadNewOrder(newOrderBody: IsubmitOrderBody): Promise<void>{
    const query: string = `INSERT INTO project_4_schema.orders (customer_id, cart_id, final_price, ship_city, 
        ship_street, ship_house_number, ship_date_time, last_4_digits_credit_card) 
        VALUES (?,?,?,?,?,?,?,?)`;
    await getConnection().execute(query, [...Object.values(newOrderBody)]);
};


export { uploadNewOrder, IsubmitOrderBody };
