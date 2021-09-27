import React from 'react';
import { TextInput } from 'react-admin';

export function JsonInput({ ...props }: any) {
    return <TextInput 
        {...props} 
        format={formValue => JSON.stringify(formValue, null, 4)}
        parse={inputValue => JSON.parse(inputValue)}
    />
}
