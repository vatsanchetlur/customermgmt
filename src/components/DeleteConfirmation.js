import React from 'react';

const DeleteConfirmation = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="delete-confirmation">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this customer?</p>
            <button onClick={onConfirm}>Yes, Delete</button>
            <button onClick={onCancel}>Cancel</button>
        </div>
    );
};

export default DeleteConfirmation;