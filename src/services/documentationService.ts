import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  orderBy, 
  query,
  setDoc,
  updateDoc,
  deleteDoc,
  where,
  DocumentData
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DocCategory, DocPage, DocCategoryWithPages } from '../types/documentation';

// Document Categories
export const getCategories = async (): Promise<DocCategory[]> => {
  try {
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, orderBy('order'));
    
    const querySnapshot = await getDocs(q);
    const categories: DocCategory[] = [];
    
    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() } as DocCategory);
    });
    
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const getCategory = async (id: string): Promise<DocCategory | null> => {
  try {
    const docRef = doc(db, 'categories', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as DocCategory;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
};

export const createCategory = async (category: Omit<DocCategory, 'id'>): Promise<DocCategory> => {
  try {
    const docRef = doc(collection(db, 'categories'));
    const newCategory = { ...category, id: docRef.id };
    await setDoc(docRef, newCategory);
    return newCategory;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategory = async (id: string, updates: Partial<DocCategory>): Promise<void> => {
  try {
    const docRef = doc(db, 'categories', id);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'categories', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

// Document Pages
export const getPages = async (categoryId?: string): Promise<DocPage[]> => {
  try {
    let pagesRef = collection(db, 'pages');
    let q;
    
    if (categoryId) {
      q = query(
        pagesRef,
        where('categoryId', '==', categoryId),
        orderBy('order')
      );
    } else {
      q = query(pagesRef, orderBy('categoryId'), orderBy('order'));
    }
    
    const querySnapshot = await getDocs(q);
    const pages: DocPage[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as DocumentData;
      pages.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        publishedAt: data.publishedAt?.toDate() || null
      } as DocPage);
    });
    
    return pages;
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
};

export const getPage = async (id: string): Promise<DocPage | null> => {
  try {
    const docRef = doc(db, 'pages', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as DocumentData;
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        publishedAt: data.publishedAt?.toDate() || null
      } as DocPage;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
};

export const getPagesByCategoryId = async (categoryId: string): Promise<DocPage[]> => {
  try {
    const pagesRef = collection(db, 'pages');
    const q = query(pagesRef, where('categoryId', '==', categoryId), orderBy('order'));
    const querySnapshot = await getDocs(q);

    const pages: DocPage[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as DocumentData;
      pages.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        publishedAt: data.publishedAt?.toDate() || null,
      } as DocPage);
    });

    return pages;
  } catch (error) {
    console.error('Error fetching pages by category ID:', error);
    return [];
  }
};



export const getPageBySlug = async (categorySlug: string, pageSlug: string): Promise<DocPage | null> => {
  try {
    const pagesRef = collection(db, 'pages');
    const q = query(pagesRef, where('slug', '==', pageSlug));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    let foundPage: DocPage | null = null;
    
    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data() as DocumentData;
      // Check if the page belongs to a category with the specified slug
      const categoryRef = doc(db, 'categories', data.categoryId);
      const categorySnap = await getDoc(categoryRef);
      
      if (categorySnap.exists() && categorySnap.data().slug === categorySlug) {
        foundPage = {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          publishedAt: data.publishedAt?.toDate() || null
        } as DocPage;
        break;
      }
    }
    
    return foundPage;
  } catch (error) {
    console.error('Error fetching page by slug:', error);
    return null;
  }
};

export const createPage = async (page: Omit<DocPage, 'id' | 'createdAt' | 'updatedAt'>): Promise<DocPage> => {
  try {
    const docRef = doc(collection(db, 'pages'));
    const createdAt = new Date();
    const updatedAt = new Date();
    
    const newPage: DocPage = {
      id: docRef.id,
      ...page,
      createdAt,
      updatedAt,
    };
    
    await setDoc(docRef, {
      ...page,
      createdAt,
      updatedAt,
    });
    
    return newPage;
  } catch (error) {
    console.error('Error creating page:', error);
    throw error;
  }
};

export const updatePage = async (id: string, pageData: Partial<DocPage>): Promise<void> => {
  try {
    const docRef = doc(db, 'pages', id);
    const updatedAt = new Date();
    
    await updateDoc(docRef, {
      ...pageData,
      updatedAt,
    });
  } catch (error) {
    console.error('Error updating page:', error);
    throw error;
  }
};

export const deletePage = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'pages', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting page:', error);
    throw error;
  }
};

// Get categories with their pages
export const getCategoriesWithPages = async (publishedOnly: boolean = false): Promise<DocCategoryWithPages[]> => {
  try {
    // Get all categories
    const categories = await getCategories();
    
    // Get all pages (we'll filter them by category later)
    const allPages = await getPages();
    
    // Map categories to include their pages
    const result: DocCategoryWithPages[] = categories.map(category => {
      // Filter pages that belong to this category
      const categoryPages = allPages.filter(page => {
        // Apply published filter if needed
        if (publishedOnly) {
          return page.categoryId === category.id && page.published === true;
        }
        return page.categoryId === category.id;
      });
      
      // Sort pages by order
      categoryPages.sort((a, b) => a.order - b.order);
      
      return {
        ...category,
        pages: categoryPages
      };
    });
    
    return result;
  } catch (error) {
    console.error('Error fetching categories with pages:', error);
    return [];
  }
};
