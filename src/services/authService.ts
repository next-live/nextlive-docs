
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { AdminUser } from '../types/documentation';

// Auth functions
export const signIn = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

export const createAdminUser = async (email: string, password: string, role: 'admin' | 'editor'): Promise<AdminUser> => {
  // This would typically be done through Firebase Admin SDK on the server
  // For the demo, we'll create the user and set the role
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Add to admin users collection
  const adminUser: AdminUser = {
    uid: user.uid,
    email: user.email || '',
    role
  };
  
  await setDoc(doc(db, 'adminUsers', user.uid), adminUser);
  
  return adminUser;
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export const getUserRole = async (uid: string): Promise<'admin' | 'editor' | null> => {
  const docRef = doc(db, 'adminUsers', uid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const userData = docSnap.data() as AdminUser;
    return userData.role;
  }
  
  return null;
};

export const isUserAdmin = async (user: User | null): Promise<boolean> => {
  if (!user) return false;
  
  const role = await getUserRole(user.uid);
  return role === 'admin';
};
