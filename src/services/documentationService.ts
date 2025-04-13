
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DocCategory, DocPage } from '../types/documentation';

// Collections
const categoriesCollection = 'docCategories';
const pagesCollection = 'docPages';

// Categories
export const getCategories = async (): Promise<DocCategory[]> => {
  const q = query(collection(db, categoriesCollection), orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DocCategory));
};

export const getCategory = async (id: string): Promise<DocCategory | null> => {
  const docRef = doc(db, categoriesCollection, id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return null;
  }
  
  return { id: docSnap.id, ...docSnap.data() } as DocCategory;
};

export const getCategoryBySlug = async (slug: string): Promise<DocCategory | null> => {
  const q = query(collection(db, categoriesCollection), where('slug', '==', slug));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    return null;
  }
  
  const docData = snapshot.docs[0];
  return { id: docData.id, ...docData.data() } as DocCategory;
};

export const createCategory = async (category: Omit<DocCategory, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, categoriesCollection), category);
  return docRef.id;
};

export const updateCategory = async (id: string, category: Partial<DocCategory>): Promise<void> => {
  await updateDoc(doc(db, categoriesCollection, id), category);
};

export const deleteCategory = async (id: string): Promise<void> => {
  // First delete all pages in this category
  const pagesSnapshot = await getDocs(query(
    collection(db, pagesCollection), 
    where('categoryId', '==', id)
  ));
  
  const deletePromises = pagesSnapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
  
  // Then delete the category
  await deleteDoc(doc(db, categoriesCollection, id));
};

// Pages
export const getPages = async (categoryId?: string): Promise<DocPage[]> => {
  let q;
  
  if (categoryId) {
    q = query(
      collection(db, pagesCollection), 
      where('categoryId', '==', categoryId),
      orderBy('order', 'asc')
    );
  } else {
    q = query(collection(db, pagesCollection), orderBy('order', 'asc'));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return { 
      id: doc.id, 
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      publishedAt: data.publishedAt?.toDate()
    } as DocPage;
  });
};

export const getPage = async (id: string): Promise<DocPage | null> => {
  const docRef = doc(db, pagesCollection, id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return null;
  }
  
  const data = docSnap.data();
  return { 
    id: docSnap.id, 
    ...data,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
    publishedAt: data.publishedAt?.toDate()
  } as DocPage;
};

export const getPageBySlug = async (categorySlug: string, pageSlug: string): Promise<DocPage | null> => {
  // First get the category
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return null;
  
  // Then get the page
  const q = query(
    collection(db, pagesCollection), 
    where('categoryId', '==', category.id),
    where('slug', '==', pageSlug)
  );
  
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    return null;
  }
  
  const docData = snapshot.docs[0].data();
  return { 
    id: snapshot.docs[0].id, 
    ...docData,
    createdAt: docData.createdAt?.toDate(),
    updatedAt: docData.updatedAt?.toDate(),
    publishedAt: docData.publishedAt?.toDate()
  } as DocPage;
};

export const createPage = async (page: Omit<DocPage, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const now = serverTimestamp();
  
  const pageWithDates = {
    ...page,
    createdAt: now,
    updatedAt: now
  };
  
  const docRef = await addDoc(collection(db, pagesCollection), pageWithDates);
  return docRef.id;
};

export const updatePage = async (id: string, page: Partial<DocPage>): Promise<void> => {
  const updates = {
    ...page,
    updatedAt: serverTimestamp()
  };
  
  // If page is being published and doesn't have a publish date yet
  if (page.published && !page.publishedAt) {
    updates.publishedAt = serverTimestamp();
  }
  
  await updateDoc(doc(db, pagesCollection, id), updates);
};

export const deletePage = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, pagesCollection, id));
};

// Get both categories and pages - organized structure
export const getCategoriesWithPages = async (publishedOnly: boolean = true): Promise<DocCategory[]> => {
  const categories = await getCategories();
  
  // Get all pages at once for better performance
  let allPages = await getPages();
  
  if (publishedOnly) {
    allPages = allPages.filter(page => page.published);
  }
  
  return categories.map(category => {
    const categoryPages = allPages
      .filter(page => page.categoryId === category.id)
      .sort((a, b) => a.order - b.order);
      
    return {
      ...category,
      pages: categoryPages
    };
  });
};
