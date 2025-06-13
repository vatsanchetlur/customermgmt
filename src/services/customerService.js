// filepath: /Users/n0096336/Downloads/FullStack/capstone2/customer-management-app/src/services/customerService.js
const API_BASE_URL = 'http://localhost:3001/api';

export const getCustomers = async () => {
    try {
        console.log('Fetching customers from API...');
        const response = await fetch(`${API_BASE_URL}/customers`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched customers:', data);
        return data;
    } catch (error) {
        console.error("Failed to fetch customers:", error);
        return []; // Return empty array on error
    }
};

export const addCustomer = async (customer) => {
    try {
        console.log('Adding customer:', customer);
        const response = await fetch(`${API_BASE_URL}/customers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(customer),
        });
        
        if (!response.ok) {
            if (response.status === 409) {
                // Duplicate email error
                const errorData = await response.json();
                throw new Error(errorData.message || 'This email address is already in use.');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const newCustomer = await response.json();
        console.log('Added customer:', newCustomer);
        return newCustomer;
    } catch (error) {
        console.error("Failed to add customer:", error);
        throw error;
    }
};

export const updateCustomer = async (id, updatedData) => {
    try {
        console.log('Updating customer:', id, updatedData);
        const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });
        
        if (!response.ok) {
            if (response.status === 409) {
                // Duplicate email error
                const errorData = await response.json();
                throw new Error(errorData.message || 'This email address is already in use.');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const updatedCustomer = await response.json();
        console.log('Updated customer:', updatedCustomer);
        return updatedCustomer;
    } catch (error) {
        console.error(`Failed to update customer ${id}:`, error);
        throw error;
    }
};

export const deleteCustomer = async (id) => {
    try {
        console.log('Deleting customer:', id);
        const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('Deleted customer:', id);
        return { message: 'Customer deleted successfully' };
    } catch (error) {
        console.error(`Failed to delete customer ${id}:`, error);
        throw error;
    }
};