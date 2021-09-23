import { generateUiSchema } from "./post-processed-schemas";

test('generateUiSchemaRecursive', () => {
    expect(generateUiSchema({
        some: {
            field: {
                cInputType: "blabla"
            }
        }
    })).toEqual({
        some: {
            field: {
                cInputType: {
                    "ui:widget": "hidden",
                }
            }
        }
    });

});
