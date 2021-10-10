import { AfterInsert, AfterUpdate, Check, EntitySubscriberInterface, EventSubscriber, InsertEvent, ManyToOne, OneToMany, PrimaryColumn, UpdateEvent } from "typeorm";
import { Column, Entity } from "typeorm";
import { Meta } from "@core/entity/Meta";
import { Currency } from "./Currency";

@Entity()
export class ExchangeRate {

    @PrimaryColumn({asExpression: `PKEY(start_date, currency_from_id, currency_to_id)`}) 
    id: string;

    //@Check(TODO check that dates do not overlap)
    @Column() startDate: Date;

    @ManyToOne(() => Currency)
    currencyFrom: Currency;
    @ManyToOne(() => Currency)
    currencyTo: Currency;

    @Column() rate: number;
    @Column(() => Meta) meta?: Meta;
}
