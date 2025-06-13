import React, { useState, useEffect } from 'react';
import { getCustomers } from '../services/customerService';

const CustomerForm = ({ selectedCustomer, saveError, onSave, onDelete, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Update form when a customer is selected or deselected
    useEffect(() => {
        if (selectedCustomer) {
            setFormData({
                name: selectedCustomer.name,
                email: selectedCustomer.email,
                password: selectedCustomer.password
            });
            // Clear errors when loading existing customer
            setNameError('');
            setEmailError('');
            setPasswordError('');
        } else {
            setFormData({
                name: '',
                email: '',
                password: ''
            });
            // Clear errors when resetting form
            setNameError('');
            setEmailError('');
            setPasswordError('');
        }
    }, [selectedCustomer]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Real-time validation for each field
        if (name === 'name') {
            if (!value.trim()) {
                setNameError('Name is required.');
            } else {
                setNameError('');
            }
        } else if (name === 'email') {
            if (!value) {
                setEmailError('Email is required.');
            } else if (!/\S+@\S+\.\S+/.test(value)) {
                setEmailError('Please enter a valid email address.');
            } else {
                setEmailError('');
            }
        } else if (name === 'password') {
            if (!value.trim()) {
                setPasswordError('Password is required.');
            } else {
                setPasswordError('');
            }
        }
    };

    const handleSave = async () => {
        // Reset all errors first
        let hasErrors = false;

        // Validate name
        if (!formData.name.trim()) {
            setNameError('Name is required.');
            hasErrors = true;
        } else {
            setNameError('');
        }

        // Validate email format
        if (!formData.email.trim()) {
            setEmailError('Email is required.');
            hasErrors = true;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setEmailError('Please enter a valid email address.');
            hasErrors = true;
        } else {
            // Check for duplicate email
            try {
                const existingCustomers = await getCustomers();
                const duplicateCustomer = existingCustomers.find(customer => 
                    customer.email.toLowerCase() === formData.email.toLowerCase() && 
                    (!selectedCustomer || customer.id !== selectedCustomer.id)
                );
                
                if (duplicateCustomer) {
                    setEmailError('This email address is already in use by another customer.');
                    hasErrors = true;
                } else {
                    setEmailError('');
                }
            } catch (error) {
                console.error('Error checking for duplicate email:', error);
                setEmailError('Unable to validate email. Please try again.');
                hasErrors = true;
            }
        }

        // Validate password
        if (!formData.password.trim()) {
            setPasswordError('Password is required.');
            hasErrors = true;
        } else {
            setPasswordError('');
        }

        // Don't save if there are validation errors
        if (hasErrors) {
            return;
        }
        
        // Call the onSave function and wait for result
        const success = await onSave(formData);
        
        // Clear form only if adding (not updating) and save was successful
        if (!selectedCustomer && success) {
            setFormData({
                name: '',
                email: '',
                password: ''
            });
        }
    };

    const handleDelete = () => {
        if (selectedCustomer) {
            onDelete(selectedCustomer.id);
        }
    };

    const handleCancel = () => {
        // Clear all form fields
        setFormData({
            name: '',
            email: '',
            password: ''
        });
        
        // Clear all validation errors
        setNameError('');
        setEmailError('');
        setPasswordError('');
        
        // Call parent's cancel handler (this will clear saveError in App component)
        onCancel();
    };

    return (
        <div className="customer-form-section">
            <h2>{selectedCustomer ? 'Update' : 'Add'}</h2>
            {saveError && <div className="error-message server-error">{saveError}</div>}
            <div className="form-group">
                <label>Name:</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Customer Name"
                />
            </div>
            {nameError && <p className="error-message">{nameError}</p>}
            <div className="form-group">
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@company.com"
                />
            </div>
            {emailError && <p className="error-message">{emailError}</p>}
            <div className="form-group">
                <label>Pass:</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="password"
                />
            </div>
            {passwordError && <p className="error-message">{passwordError}</p>}
            <div className="button-group">
                <button onClick={handleDelete} disabled={!selectedCustomer}>
                    Delete
                </button>
                <button onClick={handleSave}>
                    Save
                </button>
                <button onClick={handleCancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default CustomerForm;