import { Connection, createConnection } from "typeorm";
const SnakeNamingStrategy = require('typeorm-naming-strategies').SnakeNamingStrategy;
import { SetTenantSubscriber } from "./core-orm/SetTenantSubscriber";
import { PrwDictionary } from "@core/entity/PrwDictionary";
import { PrwPage } from "@core/entity/PrwPage";
import { PrwPermission } from "@core/entity/PrwPermission";
import { PrwRole } from "@core/entity/PrwRole";
import { FrmdbSystemParam } from "@core/entity/PrwSystemParam";
import { PrwTable } from "@core/entity/PrwTable";
import { PrwTableColumn } from "@core/entity/PrwTableColumn";
import { PrwUser } from "@core/entity/PrwUser";
import { Currency } from "./apps/00_base/entity/Currency";
import { ExchangeRate } from "./apps/00_base/entity/ExchangeRate";
import { Section, SubSection } from "./apps/10_websites/entity/Section";
import { StaticPage } from "./apps/10_websites/entity/StaticPage";
import { Customer } from "./apps/crm/entity/Customer";
import { InventoryLevel } from "./apps/inventory/entity/InventoryLevel";
import { InventoryTransaction, InventoryTransactionProduct } from "./apps/inventory/entity/InventoryTransaction";
import { ProductCategory } from "./apps/inventory/entity/ProductCategory";
import { ProductType } from "./apps/inventory/entity/ProductType";
import { Supplier, SupplierBill } from "./apps/inventory/entity/Supplier";
import { Equipment } from "./apps/service/entity/Equipment";
import { EquipmentCategory } from "./apps/service/entity/EquipmentCategory";
import { EquipmentType } from "./apps/service/entity/EquipmentType";
import { ServiceForm, ServiceFormCode, ServiceFormEquipment } from "./apps/service/entity/ServiceForm";
import { Technician } from "./apps/service/entity/Technician";
import { TravelForm, TravelFormProduct, TravelFormLevels } from "./apps/service/entity/TravelForm";
import { PrwTenant } from "@core/entity/PrwTenant";


const database = {
    development: 'dev',
    production: 'postgres',
    test: 'test'
};
export const BASE_CONNECTION = {
    username: "postgres",
    password: "postgres",
    database: database[process.env.NODE_ENV],
    host: 'db',
    port: 5432,
    namingStrategy: new SnakeNamingStrategy(),
    logging: true,
    extra: { max: 1, connectionLimit: 1 },
    entities: [
        PrwTenant,
        PrwDictionary,
        PrwPage,
        PrwPermission,
        PrwRole,
        FrmdbSystemParam,
        PrwTable,
        PrwTableColumn,
        PrwUser,
        Currency,
        ExchangeRate,
        Section,
        SubSection,
        StaticPage,
        Customer,
        InventoryLevel,
        InventoryTransaction,
        InventoryTransactionProduct,
        ProductCategory,
        ProductType,
        Supplier,
        SupplierBill,
        Equipment,
        EquipmentCategory,
        EquipmentType,
        ServiceForm,
        ServiceFormCode,
        ServiceFormEquipment,
        Technician,
        TravelForm,
        TravelFormProduct,
        TravelFormLevels,
    ],
    subscribers: [
        // SetTenantSubscriber, -- not needed anymore, doing it after createConnection
    ],
};

export const PRW_CONN_P = createConnection({
    ...BASE_CONNECTION,
    name: "prw",
    type: "postgres",
    schema: "prw",
}).then(async (conn) => {
    await conn.query(`SET search_path TO prw;`)
    return conn;
});
