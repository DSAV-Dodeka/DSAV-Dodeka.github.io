import { type FormEvent } from 'react'
import './ModalForm.scss'


interface ModalFormProps {
    Content: React.ReactNode
    onSubmit: (e: FormEvent) => void
}


const ModalForm = (props: ModalFormProps) => {
    
    return (
        <form className="modal-form" onSubmit={props.onSubmit}>            
            {props.Content}
        </form>
    )
}

export default ModalForm;