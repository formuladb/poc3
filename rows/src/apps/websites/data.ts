import "reflect-metadata";
import {createConnection, getRepository } from "typeorm";
import { putRow } from "../../core/orm/putRow";
import {Page} from "./entity/Page";

createConnection().then(async connection => {

    await putRow(Page, {meta: {tenant: "base-app"}, id: "landing-page", title: "FormulaDB Themes"});

}).catch(error => console.log(error));
