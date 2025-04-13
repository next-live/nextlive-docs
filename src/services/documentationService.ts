import { 
  collection, 
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  DocumentReference,
  CollectionReference
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DocCategory, DocPage, DocCategoryWithPages } from '../types/documentation';

// Categories
export const getCategories = async (publishedOnly: boolean = false): Promise<DocCategory[]> => {
  let q = query(collection(db, 'categories'));
  
  if (publishedOnly) {
    q = query(q, where('published', '==', true));
  }
  
  q = query(q, orderBy('order', 'asc'));
  
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as DocCategory[];
};

export const getCategoryById = async (id: string): Promise<DocCategory | null> => {
  const docRef = doc(db, 'categories', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as DocCategory;
  } else {
    return null;
  }
};

export const createCategory = async (category: Omit<DocCategory, 'id'>): Promise<DocumentReference> => {
  return await addDoc(collection(db, 'categories'), {
    ...category,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const updateCategory = async (id: string, updates: Partial<DocCategory>): Promise<void> => {
  const docRef = doc(db, 'categories', id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

export const deleteCategory = async (id: string): Promise<void> => {
  const docRef = doc(db, 'categories', id);
  await deleteDoc(docRef);
};

// Pages
export const getPages = async (categoryId: string, publishedOnly: boolean = false): Promise<DocPage[]> => {
  let q = query(collection(db, 'categories', categoryId, 'pages'));
  
  if (publishedOnly) {
    q = query(q, where('published', '==', true));
  }
  
  q = query(q, orderBy('order', 'asc'));
  
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as DocPage[];
};

export const getPageById = async (categoryId: string, pageId: string): Promise<DocPage | null> => {
  const docRef = doc(db, 'categories', categoryId, 'pages', pageId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as DocPage;
  } else {
    return null;
  }
};

export const createPage = async (categoryId: string, page: Omit<DocPage, 'id'>): Promise<DocumentReference> => {
  return await addDoc(collection(db, 'categories', categoryId, 'pages'), {
    ...page,
    categoryId: categoryId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const updatePage = async (categoryId: string, pageId: string, updates: Partial<DocPage>): Promise<void> => {
  const docRef = doc(db, 'categories', categoryId, 'pages', pageId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

export const deletePage = async (categoryId: string, pageId: string): Promise<void> => {
  const docRef = doc(db, 'categories', categoryId, 'pages', pageId);
  await deleteDoc(docRef);
};

// Categories with Pages
export const getCategoriesWithPages = async (publishedOnly: boolean = false): Promise<DocCategoryWithPages[]> => {
  const categories = await getCategories(publishedOnly);
  
  return Promise.all(
    categories.map(async (category) => {
      const pages = await getPages(category.id, publishedOnly);
      return {
        ...category,
        pages: pages
      };
    })
  );
};

// Get page by slug
export const getPageBySlug = async (categorySlug: string, pageSlug: string): Promise<DocPage | null> => {
  const categories = await getCategories(true);
  const category = categories.find(cat => cat.slug === categorySlug);
  
  if (!category) {
    return null;
  }
  
  const pages = await getPages(category.id, true);
  const page = pages.find(p => p.slug === pageSlug);
  
  if (!page) {
    return null;
  }
  
  return page;
};

// Search pages
export const searchPages = async (searchTerm: string): Promise<DocPage[]> => {
  const categories = await getCategories(true);
  
  const allPages = await Promise.all(
    categories.map(async (category) => {
      return await getPages(category.id, true);
    })
  );
  
  const flattenedPages = allPages.flat();
  
  const results = flattenedPages.filter(page => {
    return page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           page.content.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  return results;
};

// Get all admin users (fix the typing issue)
export const getAdminUsers = async () => {
  const adminUsersRef = collection(db, 'adminUsers');
  const querySnapshot = await getDocs(adminUsersRef);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Get admin user by ID (fix the typing issue)
export const getAdminUserById = async (id: string) => {
  const docRef = doc(db, 'adminUsers', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data()
    };
  }
  
  return null;
};
