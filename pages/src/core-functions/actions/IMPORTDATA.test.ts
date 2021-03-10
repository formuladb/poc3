import parse from 'csv-parse/lib/es5';
import { DataProvider } from 'react-admin';
import { IMPORTDATA } from './IMPORTDATA';

test('should import data', async () => {
    const inputData: string[][] = await new Promise((resolve, reject) => {
        parse(CSVDATA, { delimiter: '|' },
            function (err, output) {
                if (err) reject(err);
                else resolve(output);
            }
        )
    });
    let receivedData = null;
    const dataProvider = {
        create: (resource: string, params) => {
            receivedData = params?.data;
        }
    }

    await IMPORTDATA(dataProvider as DataProvider, {
        id: 'order_product',
        field_defs: [
            { name: 'order_id', c_table_name: 'order_products', type: 'TextField', c_is_computed: false },
            { name: 'product_id', c_table_name: 'order_products', type: 'TextField', c_is_computed: false },
            { name: 'quantity', c_table_name: 'order_products', type: 'NumberField', c_is_computed: false },
        ]
    }, [
        { importedField: 'Item #', field: 'product_id' },
        { importedField: 'Quantity Shipped', field: 'quantity' }
    ],
    inputData, 'order_id', 'ord1');

    expect(receivedData).toEqual([
        { order_id: 'ord1', product_id: 'PFE500.0', quantity: 123 },
        { order_id: 'ord1', product_id: '03736', quantity: 456 },
    ]);

});

const CSVDATA = `Cmts|Line #|Item #|Description|Line Type|UOM|Quantity Ordered|Quantity Shipped|Quantity Backordered|Quantity in Base UOM|Unit Price|Extended Price|Invoice #|Next Status|Requested Date
|1.000|PFE500.0|PRESSURE FRYER ELECTRIC 4HD|W|EA|1|123|0|0.001|5,823.36|5,823.36|0|525|1/1/2039
|2.000|03736|BRUSH KIT W SCRAPER|S|EA|1|456|0|0.001|32.58|32.58|0|525|1/1/2039
`;
