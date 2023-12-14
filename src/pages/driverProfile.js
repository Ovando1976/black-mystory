import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Driver from './Driver'; // Adjust path as necessary
import styles from './driverProfilePage.module.css';

const DriverProfilePage = () => {
    const navigate = useNavigate(); // Get the `navigate` function

    // Placeholder for authentication and authorization. Adjust as per your logic.
    useEffect(() => {
        const isAuthenticated = true; // Replace with actual authentication logic
        const isDriver = true; // Replace with actual role check
        if (!isAuthenticated || !isDriver) {
            navigate('/login'); // Redirect user to login page if not authenticated or not a driver
        }
    }, [navigate]); // Empty dependencies since navigate doesn't change and you only need to check auth once

    return (
        <div className={styles.container}>
            <main className={styles.content}>
                <h1>Driver Profile</h1>
                <Driver />
                {/* You can add more components or information specific to drivers here */}
            </main>
        </div>
    );
};

export default DriverProfilePage;
