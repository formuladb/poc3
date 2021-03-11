import React, { useEffect, useState, InputHTMLAttributes } from 'react';
import { useTranslate } from 'react-admin';
import Button from '@material-ui/core/Button';
import PrintIcon from '@material-ui/icons/Print';
import { Form, Field } from 'react-final-form';

export function PrintButton({

}) {
    return (
        <div>
            <Button variant="text" color="primary" onClick={() => window.print()}>
                <PrintIcon />
            </Button>
        </div>
    );
}
