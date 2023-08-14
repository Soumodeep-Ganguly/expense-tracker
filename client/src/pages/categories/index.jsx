import React, { useEffect, useState } from 'react';
import Modal from '../../component/modal';
import Text from '../../component/inputs/text'
import Button from '../../component/button'
import Toast from '../../component/toast'
import axios from 'axios'
import Swal from 'sweetalert2'
import { UilTimes, UilPen } from '@iconscout/react-unicons'
import './index.scss'

export default function Categories() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            let res = await axios.get('/api/categories')
            setCategories(res.data.categories)
        } catch(err) {

        }
    }

    const deleteCategory = async (id) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            html: '<h5>Category will be deleted?</h5>',
            showCancelButton: true,
            confirmButtonText: `Delete`,
            confirmButtonColor: '#D14343',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/api/category/${id}`)
                    fetchCategories()
                } catch(err) {
                    Toast.fire({ icon: 'error', title: err.response?.data?.error || `Failed to delete category.` })
                }
            }
        })
    }

    return (
        <div className="category-container">
            <h1 className='page-title'>Categories</h1>
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
                {categories?.map(category => (
                    <div key={category._id} className='item'>
                        {category.name}
                        <UilPen size={16} style={{ marginTop: 3, marginLeft: 'auto' }} onClick={() => setSelectedCategory(category)} />
                        <UilTimes size={20} style={{ marginTop: 1, marginLeft: 3 }} onClick={() => deleteCategory(category._id)} />
                    </div>
                ))}
            </div>
            {(isModalOpen || selectedCategory) && <CategoryModal 
                isOpen={isModalOpen}
                selected={selectedCategory}
                onSave={() => {
                    fetchCategories()
                }}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedCategory(null)
                }}
            />}
        </div>
    )
}

const CategoryModal = (props) => {
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(props.selected) setName(props.selected?.name)
    }, [props.selected])

    const onSave = async () => {
        if(name.trim() === "") return Toast.fire({ icon: 'error', title: "Category name required." })
        
        setLoading(true)
        let uri = '/api/category'
        if(props.selected) uri += `/${props.selected?._id}` 
        
        try {
            await axios.post(uri, { name })
            setLoading(false)
            props.onSave()
            props.onClose()
        } catch(err) {
            setLoading(false)
            Toast.fire({ icon: 'error', title: err.response?.data?.error || `Unable to ${props.selected?"update":"create"} category.` })
        }
    }

    return <Modal isOpen={props.isOpen || props.selected} onClose={props.onClose} title={`${props.selected?"Edit":"Add"} Category`}>
        <div>
            <Text 
                label="Category Name"
                value={name}
                onChange={setName}
                style={{ marginTop: 20 }}
            />
        </div>
        <div>
            <Button 
                text="Create"
                className="save"
                loading={loading}
                onClick={() => onSave()}
                style={{ marginTop: 30, marginBottom: 20 }}
            />
        </div>
    </Modal>
}
