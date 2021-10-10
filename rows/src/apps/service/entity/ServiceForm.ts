import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Meta } from "@core/entity/Meta";
import { Customer } from "src/apps/crm/entity/Customer";
import { Technician } from "./Technician";
import { Equipment } from "./Equipment";
import { InventoryTransaction } from "src/apps/inventory/entity/InventoryTransaction";

const States = {ACTIVE:0, CANCELLED:0, FINALIZED:0};

@Entity()
export class ServiceForm {
    @PrimaryColumn() id: string;
    
    @OneToMany(() => ServiceFormEquipment, e => e.serviceForm)
    equipments?: ServiceFormEquipment[];

    @ManyToOne(() => Customer)
    customer: Customer;
    @ManyToOne(() => Technician)
    technician: Technician;
    @ManyToOne(() => Technician)
    technician2: Technician;

    @Column() equipment_group: string;

    time_of_arival: Date;
    time_of_departure: Date;
    normal_hours: string;
    warranty_hours: string;
    night_hours: string;
    shipment_cost: string;
    notes: string;

    customer_person: string;

    @Column({type: "enum", enum: Object.keys(States)}) 
    state!: keyof typeof States;

    @Column(() => Meta) meta?: Meta;
}

@Entity()
export class ServiceFormCode {
    @PrimaryColumn({asExpression: /*sql*/`
        --DROP MATERIALIZED VIEW service_forms_codes
        CREATE MATERIALIZED VIEW IF NOT EXISTS service_forms_code AS
            SELECT sf.id as id, 
                to_char(sf.time_of_arival, 'YYYY') as the_year,
                CASE 
                    WHEN to_char(sf.time_of_arival, 'YYYY') <> to_char(CURRENT_DATE, 'YYYY')
                        THEN to_char(sf.time_of_arival, 'YYYY') || '-'
                    ELSE ''
                END ||
                COALESCE(sf.equipment_group, 'EMPTY') || '-' || COALESCE(c.cost_center, 'EMPTY') || '-' || LPAD(
                    ROW_NUMBER () OVER (
                        PARTITION BY to_char(sf.time_of_arival, 'YYYY'), client__id
                        ORDER BY time_of_arival
                    )::text, 10, '0'
                ) as code
            FROM service_forms sf INNER JOIN clients c ON sf.client__id = c.id
        
    `})
    id: string;
}


@Entity()
export class ServiceFormEquipment {
    @PrimaryColumn({asExpression: `PKEY(inventory_transaction_id, product_type_id)`}) 
    id: string;

    
    @ManyToOne(() => ServiceForm, sf => sf.equipments)
    serviceForm: ServiceForm;

    @ManyToOne(() => Equipment)
    equipment: Equipment;

    //TODO set operation to EXIT
    @OneToOne(() => InventoryTransaction)
    inventoryTransaction: InventoryTransaction;

    @Column() reported_problem?: string;
    @Column() found_problem?: string;
    @Column() work_description?: string;
    @Column() nb_piston_cycles?: string;
    @Column() brita_counter?: string;
    @Column() washing_cycles?: string;
    @Column() options?: string;

    @Column(() => Meta) meta?: Meta;
}
