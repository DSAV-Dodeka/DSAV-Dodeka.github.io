import {ChangeEvent} from "react";
import React from "react"

export const formReducer = <T>(state: T, action: FormAction<T>): T => {
    switch (action.type) {
        case 'reload':
            return action.new_state
        case 'change': // Both 'change' and 'change_bool' have same effect
        case 'change_bool':
            return {
                ...state,
                [action.field]: action.value
            }
        default:
            throw new Error()
    }

}

export const handleFormChange = <T>(event: ChangeEvent<HTMLInputElement>, dispatch: React.Dispatch<FormAction<T>>) => {
    const { name, value } = event.target
    dispatch({type: 'change', field: name, value})
}

export const handleTextAreaChange = <T>(event: ChangeEvent<HTMLTextAreaElement>, dispatch: React.Dispatch<FormAction<T>>) => {
    const { name, value } = event.target
    dispatch({type: 'change', field: name, value})
}

export const handleSelectChange = <T>(event: ChangeEvent<HTMLSelectElement>, dispatch: React.Dispatch<FormAction<T>>) => {
    const { name, value } = event.target
    dispatch({type: 'change', field: name, value})
}

export const handleCheckboxChange = <T>(event: ChangeEvent<HTMLInputElement>, dispatch: React.Dispatch<FormAction<T>>) => {
    const { name, checked } = event.target
    dispatch({type: 'change_bool', field: name, value: checked});
}


export type FormAction<T> =
    | { type: 'reload', new_state: T}
    | { type: 'change', field: string, value: string }
    | { type: 'change_bool', field: string, value: boolean }

