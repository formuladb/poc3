import React from "react";
import {
    render, fireEvent, prettyDOM
} from '@testing-library/react';

import { PageNode } from "../../core/entity/page";
import { CmpSettings } from "./CmpSettings";
import { getCListSchema } from "../form/post-processed-schemas";
import { JSONSchema7 } from "json-schema";


const CListSettingSchema = getCListSchema() as JSONSchema7;
const uiSchema = {
    "ui:title": " ",
    cListType: {
        // "ui:widget": "hidden",
    },
    enabledActions: {
        items: {
            "ui:title": " ",
            actionType: {
                "ui:widget": "hidden",
            },
        }
    },
    fields: {
        items: {
            "ui:title": " ",
            cInputType: {
                "ui:widget": "hidden",
            },
        }
    },
    formActions: {
        items: {
            "ui:title": " ",
            actionType: {
                "ui:widget": "hidden",
            },
        }
    },
}

test('CmpSettings test', async () => {

    const timeStart = new Date().getTime();
    const {
        findByDisplayValue,
        findByTestId,
        findByText,
    } = render(
        <CmpSettings uiSchema={uiSchema} schema={CListSettingSchema} />
    );

    const timeEnd = new Date().getTime();
    expect(timeEnd).toBeLessThan(timeStart + 500);

});
