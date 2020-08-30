import React from 'react';
import { useAuth } from './useAuth';

const Logout = () => {
    const auth = useAuth();
    auth.signOut();
    return (
        <div>
            
        </div>
    )
};

export default Logout;