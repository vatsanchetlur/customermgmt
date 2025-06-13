import React, { useState, useEffect } from 'react';
import CustomerForm from './CustomerForm';
import CustomerList from './CustomerList';
import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from '../services/customerService';
import '../styles/styles.css';

// Fallback data in case everything else fails
const FALLBACK_CUSTOMERS = [
  { id: 1, name: 'Mike Johnson', email: 'mikej@abc.com', password: 'mikej' },
  { id: 2, name: 'Cindy Smith', email: 'cinds@abc.com', password: 'cinds' },
  { id: 3, name: 'Julio Martin', email: 'julim@abc.com', password: 'julim' }
];

const App = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [saveError, setSaveError] = useState('');

    useEffect(() => {
        const fetchCustomers = async () => {
            console.log('Fetching customers...');
            const data = await getCustomers();
            console.log('Fetched customers:', data);
            setCustomers(data);
        };
        fetchCustomers();
    }, []);

    const handleAddCustomer = async (customer) => {
        try {
            setSaveError(''); // Clear any previous errors
            const newCustomer = await addCustomer(customer);
            setCustomers([...customers, newCustomer]);
            return true; // Success
        } catch (error) {
            setSaveError(error.message);
            return false; // Failure
        }
    };

    const handleUpdateCustomer = async (customer) => {
        try {
            setSaveError(''); // Clear any previous errors
            const updatedCustomer = await updateCustomer(customer.id, customer);
            setCustomers(customers.map(c => (c.id === customer.id ? updatedCustomer : c)));
            setSelectedCustomer(null);
            return true; // Success
        } catch (error) {
            setSaveError(error.message);
            return false; // Failure
        }
    };

    const handleDeleteCustomer = async (id) => {
        await deleteCustomer(id);
        setCustomers(customers.filter(c => c.id !== id));
        setSelectedCustomer(null);
    };

    const handleSelectCustomer = (customer) => {
        // Toggle selection when clicking on already selected customer
        if (selectedCustomer && selectedCustomer.id === customer.id) {
            setSelectedCustomer(null);
        } else {
            setSelectedCustomer(customer);
        }
    };

    const handleCancel = () => {
        setSelectedCustomer(null);
        setSaveError(''); // Clear any save errors when canceling
    };

    return (
        <div className="app">
            <h1>Customer Management</h1>
            <div className="container">
                <CustomerList 
                    customers={customers} 
                    onSelect={handleSelectCustomer} 
                    selectedCustomer={selectedCustomer} 
                />
                <CustomerForm 
                    selectedCustomer={selectedCustomer} 
                    saveError={saveError}
                    onSave={async (customer) => {
                        if (selectedCustomer) {
                            return await handleUpdateCustomer({...selectedCustomer, ...customer});
                        } else {
                            return await handleAddCustomer(customer);
                        }
                    }}
                    onDelete={handleDeleteCustomer} 
                    onCancel={handleCancel} 
                />
            </div>
        </div>
    );
};

export default App;