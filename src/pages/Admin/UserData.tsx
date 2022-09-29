import React, {useContext, useEffect, useReducer, useState, ChangeEvent, FocusEvent, Fragment, FormEvent} from "react";
import {z} from "zod";
import './ConfirmUser.scss'

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import {UserData, ud_request} from "../../functions/api";
import AuthContext from "../Auth/AuthContext";

const columnHelper = createColumnHelper<UserData>()

const columns = [
    columnHelper.accessor('firstname', {
        header: () => 'First Name',
    }),
    columnHelper.accessor('lastname', {
        header: () => 'Last Name',
    }),
    columnHelper.accessor('phone', {
        header: () => 'Phone',
    }),
    columnHelper.accessor('email', {
        header: () => 'Email',
    }),
    columnHelper.accessor('phone', {
        header: () => 'Telefoonnummer',
    }),
    columnHelper.accessor('user_id', {
        header: () => 'User ID',
    }),
    columnHelper.accessor('callname', {
        header: () => 'Roepnaam',
    }),
    columnHelper.accessor('av40id', {
        header: () => 'AV`40 nummer',
    }),
    columnHelper.accessor('joined', {
        header: () => 'Lid sinds',
    }),
    columnHelper.accessor('eduinstitution', {
        header: () => 'Onderwijsinstelling',
    }),
    columnHelper.accessor('birthdate', {
        header: () => 'Geboortedatum',
    }),
    columnHelper.accessor('registered', {
        header: () => 'Is registreerd?',
    }),
]

const defaultData: UserData[] = [
    {
        firstname: 'Arnold',
        lastname: 'Aardvarken',
        phone: '+31612121212',
        email: 'arnold@dsavdodeka.nl',
        user_id: '0_arnold',
        callname: 'Arnold',
        av40id: 12,
        joined: '2022-02-25',
        eduinstitution: 'TU Delft',
        birthdate: '2022-02-25',
        registered: false
    },
]

