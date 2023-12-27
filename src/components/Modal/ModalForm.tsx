import { FormEvent } from "react";
import './ModalForm.scss'

const ModalForm = () => {
    const onSubmit = (e: FormEvent) => {
        e.preventDefault()


    }
    
    return (
        <form onSubmit={onSubmit}>
            <label className="modal-form-label" htmlFor="mod1">Label</label><input id='mod1' type='text'></input>
        </form>
    )
}

export default ModalForm;