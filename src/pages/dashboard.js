import { Link } from 'react-router-dom';
import styles from './dashboard.module.css';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { app } from '../Firebase/firebaseConfig';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const auth = getAuth(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // User is authenticated, let's fetch user data from Firestore
                const userRef = doc(app, 'users', firebaseUser.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    setUser(userDoc.data());
                } else {
                    console.error('User document not found!');
                }
            } else {
                // User is not authenticated, redirecting to login
                // Here, you can use the useHistory hook for redirection.
            }
        });

        // Cleanup the subscription on component unmount
        return () => unsubscribe();
    }, [auth]);

    return (
        <div className={styles.container}>
            <Header>
                <title>USVI Explorer - Dashboard</title>
                <meta name="description" content="Your personal dashboard on USVI Explorer." />
            </Header>

            <NavBar />

            <main className={styles.content}>
                <h1 className={styles.header}>Welcome, {user ? user.name : 'Guest'}!</h1>

                {user && (
                    <div className={styles.userInfo}>
                        <p>Membership Level: {user.membership}</p>
                        <p>Points: {user.points}</p>
                    </div>
                )}

                <section className={styles.featuredTours}>
                    <h2>Featured Tours</h2>
                    {/* Fetch and display featured tours here */}
                </section>

                <section className={styles.recentActivity}>
                    <h2>Recent Activity</h2>
                    {/* Fetch and display user's recent activity here */}
                </section>

                <nav className={styles.actions}>
                    <Link to="/profile" className={styles.actionButton}>View Profile</Link>
                    <Link to="/bookings" className={styles.actionButton}>My Bookings</Link>
                    <Link to="/groups" className={styles.actionButton}>My Groups</Link>
                </nav>
            </main>
        </div>
    );
};

export default Dashboard;

