import React, { Component } from "react";
import PropTypes from "prop-types";
import * as types from "@rjsf/core/dist/cjs/types";
import {
    getUiOptions,
    getWidget,
    guessType,
    retrieveSchema,
    getDefaultFormState,
    getMatchingOption,
    deepEquals,
    resolveSchema,
} from "@rjsf/core/dist/cjs/utils";
import { FieldProps } from '@rjsf/core';

class AnyOfField extends Component<any> {
    state: { selectedOption: any };
    constructor(props) {
        super(props);

        const { formData, options, uiSchema } = this.props;
        this.state = {
            selectedOption: this.getMatchingOption(formData, options),
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            !deepEquals(this.props.formData, prevProps.formData) &&
            this.props.idSchema.$id === prevProps.idSchema.$id
        ) {
            const matchingOption = this.getMatchingOption(
                this.props.formData,
                this.props.options
            );

            if (!prevState || matchingOption === this.state.selectedOption) {
                return;
            }

            this.setState({
                selectedOption: matchingOption,
            });
        }
    }

    getMatchingOption(formData, options) {
        const { widget = "select", ...uiOptions } = getUiOptions(this.props.uiSchema);
        const { rootSchema } = this.props.registry;

        //console.debug(this.props);
        if (uiOptions.anyOfDiscriminatorField && formData) {
            let selectedDiscriminatorValue = formData[uiOptions.anyOfDiscriminatorField];
            //console.debug(uiOptions.anyOfDiscriminatorField, selectedDiscriminatorValue, formData);
            for (let [idx, option] of this.props.options.entries()) {
                let opt = option;
                if (option.hasOwnProperty('$ref')) {
                    opt = resolveSchema(option, rootSchema, formData);
                }
                if (opt?.properties?.[uiOptions.anyOfDiscriminatorField]?.enum?.[0] === selectedDiscriminatorValue) {
                    //console.debug(option);
                    return idx;
                }
            }
        }

        let option = getMatchingOption(formData, options, rootSchema);
        if (option !== 0) {
            return option;
        }
        // If the form data matches none of the options, use the currently selected
        // option, assuming it's available; otherwise use the first option
        return this && this.state ? this.state.selectedOption : 0;
    }

    onOptionChange = option => {
        const selectedOption = parseInt(option, 10);
        const { formData, onChange, options, registry } = this.props;
        const { rootSchema } = registry;
        const newOption = retrieveSchema(
            options[selectedOption],
            rootSchema,
            formData
        );

        // If the new option is of type object and the current data is an object,
        // discard properties added using the old option.
        let newFormData = undefined as undefined | object;
        if (
            guessType(formData) === "object" &&
            (newOption.type === "object" || newOption.properties)
        ) {
            newFormData = Object.assign({}, formData);

            const optionsToDiscard = options.slice();
            optionsToDiscard.splice(selectedOption, 1);

            // Discard any data added using other options
            for (const option of optionsToDiscard) {
                if (option.properties) {
                    for (const key in option.properties) {
                        if (newFormData!.hasOwnProperty(key)) {
                            delete newFormData![key];
                        }
                    }
                }
            }
        }
        // Call getDefaultFormState to make sure defaults are populated on change.
        onChange(
            getDefaultFormState(options[selectedOption], newFormData, rootSchema)
        );

        this.setState({
            selectedOption: parseInt(option, 10),
        });
    };

    render() {
        const {
            baseType,
            disabled,
            errorSchema,
            formData,
            idPrefix,
            idSchema,
            onBlur,
            onChange,
            onFocus,
            options,
            registry,
            uiSchema,
            schema,
        } = this.props;

        const _SchemaField = registry.fields.SchemaField;
        const { widgets } = registry;
        const { selectedOption } = this.state;
        const { widget = "select", ...uiOptions } = getUiOptions(uiSchema);
        const Widget = getWidget({ type: "number" }, widget, widgets);

        const option = options[selectedOption] || null;
        let optionSchema;

        if (option) {
            // If the subschema doesn't declare a type, infer the type from the
            // parent schema
            optionSchema = option.type
                ? option
                : Object.assign({}, option, { type: baseType });
        }

        const { rootSchema } = this.props.registry;
        const enumOptions = options.map((option, index) => {
            if (uiOptions.anyOfDiscriminatorField) {
                let opt = option;
                if (option.hasOwnProperty('$ref')) {
                    opt = resolveSchema(option, rootSchema, formData);
                }
                //console.debug(opt);
                return {
                    label: opt?.properties?.[uiOptions.anyOfDiscriminatorField]?.enum?.[0],
                    value: index,
                };
            } else return {
                label: option.title || `Option ${index + 1}`,
                value: index,
            };
        });

        return (
            <div className="panel panel-default panel-body">
                <div className="form-group">
                    <Widget
                        id={`${idSchema.$id}${schema.oneOf ? "__oneof_select" : "__anyof_select"
                            }`}
                        schema={{ type: "number", default: 0 }}
                        onChange={this.onOptionChange}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        value={selectedOption}
                        options={{ enumOptions }}
                        {...uiOptions}
                    />
                </div>

                {option !== null && (
                    <_SchemaField
                        schema={optionSchema}
                        uiSchema={uiSchema}
                        errorSchema={errorSchema}
                        idSchema={idSchema}
                        idPrefix={idPrefix}
                        formData={formData}
                        onChange={onChange}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        registry={registry}
                        disabled={disabled}
                    />
                )}
            </div>
        );
    }
}

(AnyOfField as any).defaultProps = {
    disabled: false,
    errorSchema: {},
    idSchema: {},
    uiSchema: {},
};

if (process.env.NODE_ENV !== "production") {
    (AnyOfField as any).propTypes = {
        options: PropTypes.arrayOf(PropTypes.object).isRequired,
        baseType: PropTypes.string,
        uiSchema: PropTypes.object,
        idSchema: PropTypes.object,
        formData: PropTypes.any,
        errorSchema: PropTypes.object,
        registry: types.registry.isRequired,
    };
}

export default AnyOfField;
