import React, { useState } from 'react';

const CustomerList = ({ customers, onSelect, selectedCustomer }) => {
    const [visiblePasswords, setVisiblePasswords] = useState(new Set());

    const togglePasswordVisibility = (customerId, event) => {
        event.stopPropagation(); // Prevent row selection when clicking eye icon
        
        const newVisiblePasswords = new Set(visiblePasswords);
        if (newVisiblePasswords.has(customerId)) {
            newVisiblePasswords.delete(customerId);
        } else {
            newVisiblePasswords.add(customerId);
        }
        setVisiblePasswords(newVisiblePasswords);
    };

    return (
        <div className="customer-list-section">
            <h2>Customer List</h2>
            <table className="customer-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Password</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr 
                            key={customer.id} 
                            onClick={() => onSelect(customer)}
                            className={selectedCustomer && selectedCustomer.id === customer.id ? 'selected' : ''}
                        >
                            <td>{customer.name}</td>
                            <td>{customer.email}</td>
                            <td className="password-cell">
                                <span className="password-text">
                                    {visiblePasswords.has(customer.id) 
                                        ? customer.password 
                                        : '*'.repeat(customer.password.length)
                                    }
                                </span>
                                <button 
                                    className="password-toggle"
                                    onClick={(e) => togglePasswordVisibility(customer.id, e)}
                                    title={visiblePasswords.has(customer.id) ? "Hide password" : "Show password"}
                                >
                                    {visiblePasswords.has(customer.id) ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CustomerList;