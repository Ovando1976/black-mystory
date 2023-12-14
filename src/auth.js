import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const auth = getAuth();

// Sign Up
export const signUp = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        return { user };
    } catch (error) {
        console.error('Error signing up:', error);
        return { error };
    }
}

// Sign In
export const signIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        return { user };
    } catch (error) {
        console.error('Error signing in:', error);
        return { error };
    }
}

// Sign Out
export const signOutUser = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error('Error signing out:', error);
        return { error };
    }
}

// Get current user
export const getCurrentUser = () => {
    return auth.currentUser;
}
