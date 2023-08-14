import React, { useEffect, useState } from 'react';
import Modal from '../../component/modal';
import Text from '../../component/inputs/text'
import Select from 'react-select';
import Button from '../../component/button'
import Toast from '../../component/toast'
import axios from 'axios'
import Swal from 'sweetalert2'
import { UilTimes, UilPen } from '@iconscout/react-unicons'
import TextArea from '../../component/inputs/textarea';
import './index.scss'

export default function Expenses() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchExpenses()
        loadOptions('')
    }, [])

    const loadOptions = async (inputValue) => {
        try {
            const res = await axios.get(`/api/categories-select?q=${inputValue}`);
            setCategories(res.data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchExpenses = async () => {
        try {
            let res = await axios.get('/api/expenses')
            setExpenses(res.data.expenses)
        } catch(err) {

        }
    }

    const deleteExpense = async (id) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            html: '<h5>Expense will be deleted?</h5>',
            showCancelButton: true,
            confirmButtonText: `Delete`,
            confirmButtonColor: '#D14343',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/api/expense/${id}`)
                    fetchExpenses()
                } catch(err) {
                    Toast.fire({ icon: 'error', title: err.response?.data?.error || `Failed to delete expense.` })
                }
            }
        })
    }

    return (
        <div className="expense-container">
            <h1 className='page-title'>Expenses</h1>
            <div>
                <Button 
                    text="Create"
                    className="createBtn"
                    onClick={() => setIsModalOpen(true)}
                    style={{ marginTop: 10, marginBottom: 20 }}
                    width={100}
                />
            </div>
            <div className='item-container'>
                {expenses?.map(expense => (
                    <div key={expense._id} className='item'>
                        {expense.description}
                        <UilPen size={16} style={{ marginTop: 3, marginLeft: 'auto' }} onClick={() => setSelectedExpense(expense)} />
                        <UilTimes size={20} style={{ marginTop: 1, marginLeft: 3 }} onClick={() => deleteExpense(expense._id)} />
                    </div>
                ))}
            </div>
            {(isModalOpen || selectedExpense) && <ExpenseModal 
                isOpen={isModalOpen}
                selected={selectedExpense}
                categories={categories}
                fetchCategories={loadOptions}
                onSave={() => {
                    fetchExpenses()
                }}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedExpense(null)
                }}
            />}
        </div>
    )
}

const ExpenseModal = (props) => {
    const [searchCategory, setSearchCategory] = useState('');
    const [description, setDescription] = useState("")
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date());
    const [category, setCategory] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(props.selected) {
            setDescription(props.selected?.description)
            setAmount(props.selected?.amount)
            setCategory(props.selected?.category)
            setDate(new Date(props.selected?.date))
        }
    }, [props.selected])

    const onSave = async () => {
        if(description.trim() === "") return Toast.fire({ icon: 'error', title: "Expense description required." })
        if(!category) return Toast.fire({ icon: 'error', title: "Expense description required." })
        
        setLoading(true)
        let uri = '/api/expense'
        if(props.selected) uri += `/${props.selected?._id}` 
        
        try {
            await axios.post(uri, { description, amount, date, category: category?._id })
            setLoading(false)
            props.onSave()
            props.onClose()
        } catch(err) {
            setLoading(false)
            Toast.fire({ icon: 'error', title: err.response?.data?.error || `Unable to ${props.selected?"update":"create"} expense.` })
        }
    }

    const handleInputChange = (newValue) => {
        setSearchCategory(newValue);
        props.fetchCategories(newValue);
    };

    return <Modal isOpen={props.isOpen || props.selected} onClose={props.onClose} title={`${props.selected?"Edit":"Add"} Expense`}>
        <div>
            <TextArea 
                label="Description"
                value={description}
                onChange={setDescription}
                style={{ marginTop: 20 }}
            />
            <Select
                options={props.categories}
                onInputChange={handleInputChange}
                getOptionValue={(option) => option._id}
                getOptionLabel={(option) => option.name} 
                placeholder="Select a Category" 
                className="my-select"
                value={category}
                onChange={(value) => setCategory(value)}
            />
            <Text
                label="Amount"
                value={amount}
                onChange={setAmount}
                style={{ marginTop: 30 }}
            />
            <Text
                label="Date"
                type="date"
                value={date}
                onChange={setDate}
                style={{ marginTop: 30 }}
            />
        </div>
        <div>
            <Button 
                text={props.selected?"Save":"Create"}
                className="save"
                loading={loading}
                onClick={() => onSave()}
                style={{ marginTop: 30, marginBottom: 20 }}
            />
        </div>
    </Modal>
}