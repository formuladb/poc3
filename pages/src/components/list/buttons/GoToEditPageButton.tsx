import React from 'react';
import { Record } from 'react-admin';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';

export function GoToEditPageButton({
    resource,
    record = {} as Record,
}) {
    return (
        <div>
            <Button component={Link}
                to={`/${resource}/${record!.id}`}
            >
                <EditIcon fontSize="small" />
            </Button>
        </div>
    );
}