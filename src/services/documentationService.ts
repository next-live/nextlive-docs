
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DocCategory, DocCategoryWithPages, DocPage } from '../types/documentation';

// Collection references
const categoriesCollection = collection(db, 'categories');
const pagesCollection = collection(db, 'pages');

// Category functions
export async function getCategories(): Promise<DocCategory[]> {
  try {
    const categoriesSnapshot = await getDocs(query(categoriesCollection, orderBy('order')));
    return categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title,
      slug: doc.data().slug,
      description: doc.data().description,
      order: doc.data().order
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getCategoriesWithPages(includeUnpublished = false): Promise<DocCategoryWithPages[]> {
  try {
    // Get all categories first
    const categories = await getCategories();
    
    // Create an array to hold the results
    const categoriesWithPages: DocCategoryWithPages[] = [];
    
    // For each category, get its pages
    for (const category of categories) {
      let pagesQuery = query(
        pagesCollection,
        where('categoryId', '==', category.id),
        orderBy('order')
      );
      
      if (!includeUnpublished) {
        pagesQuery = query(pagesQuery, where('published', '==', true));
      }
      
      const pagesSnapshot = await getDocs(pagesQuery);
      
      const pages = pagesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          slug: data.slug,
          content: data.content,
          categoryId: data.categoryId,
          published: data.published,
          order: data.order,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : null,
          publishedAt: data.publishedAt instanceof Timestamp ? data.publishedAt.toDate() : null
        } as DocPage;
      });
      
      categoriesWithPages.push({
        ...category,
        pages
      });
    }
    
    return categoriesWithPages;
  } catch (error) {
    console.error('Error fetching categories with pages:', error);
    return [];
  }
}

export async function getCategory(id: string): Promise<DocCategory | null> {
  try {
    const categoryDoc = await getDoc(doc(categoriesCollection, id));
    if (!categoryDoc.exists()) return null;
    
    const data = categoryDoc.data();
    return {
      id: categoryDoc.id,
      title: data.title,
      slug: data.slug,
      description: data.description,
      order: data.order
    };
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

export async function getCategoryBySlug(slug: string): Promise<DocCategory | null> {
  try {
    const categoriesSnapshot = await getDocs(query(categoriesCollection, where('slug', '==', slug)));
    if (categoriesSnapshot.empty) return null;
    
    const categoryDoc = categoriesSnapshot.docs[0];
    const data = categoryDoc.data();
    return {
      id: categoryDoc.id,
      title: data.title,
      slug: data.slug,
      description: data.description,
      order: data.order
    };
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return null;
  }
}

export async function createCategory(category: Omit<DocCategory, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(categoriesCollection, {
      ...category,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

export async function updateCategory(id: string, category: Partial<DocCategory>): Promise<void> {
  try {
    await updateDoc(doc(categoriesCollection, id), {
      ...category,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    // First, delete all pages in this category
    const pagesSnapshot = await getDocs(query(pagesCollection, where('categoryId', '==', id)));
    const deletePromises = pagesSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    // Then delete the category
    await deleteDoc(doc(categoriesCollection, id));
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

// Page functions
export async function getPages(categoryId?: string): Promise<DocPage[]> {
  try {
    let pagesQuery = pagesCollection;
    
    if (categoryId) {
      pagesQuery = query(pagesCollection, where('categoryId', '==', categoryId), orderBy('order'));
    } else {
      pagesQuery = query(pagesCollection, orderBy('categoryId'), orderBy('order'));
    }
    
    const pagesSnapshot = await getDocs(pagesQuery);
    return pagesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        slug: data.slug,
        content: data.content,
        categoryId: data.categoryId,
        published: data.published,
        order: data.order,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : null,
        publishedAt: data.publishedAt instanceof Timestamp ? data.publishedAt.toDate() : null
      } as DocPage;
    });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
}

export async function getPage(id: string): Promise<DocPage | null> {
  try {
    const pageDoc = await getDoc(doc(pagesCollection, id));
    if (!pageDoc.exists()) return null;
    
    const data = pageDoc.data();
    return {
      id: pageDoc.id,
      title: data.title,
      slug: data.slug,
      content: data.content,
      categoryId: data.categoryId,
      published: data.published,
      order: data.order,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null,
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : null,
      publishedAt: data.publishedAt instanceof Timestamp ? data.publishedAt.toDate() : null
    };
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}

export async function getPageBySlug(categorySlug: string, pageSlug: string): Promise<DocPage | null> {
  try {
    // First, get the category ID
    const category = await getCategoryBySlug(categorySlug);
    if (!category) return null;
    
    // Then find the page with matching category ID and slug
    const pagesSnapshot = await getDocs(
      query(pagesCollection, 
        where('categoryId', '==', category.id),
        where('slug', '==', pageSlug)
      )
    );
    
    if (pagesSnapshot.empty) return null;
    
    const pageDoc = pagesSnapshot.docs[0];
    const data = pageDoc.data();
    return {
      id: pageDoc.id,
      title: data.title,
      slug: data.slug,
      content: data.content,
      categoryId: data.categoryId,
      published: data.published,
      order: data.order,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null,
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : null,
      publishedAt: data.publishedAt instanceof Timestamp ? data.publishedAt.toDate() : null
    };
  } catch (error) {
    console.error('Error fetching page by slug:', error);
    return null;
  }
}

export async function createPage(page: Omit<DocPage, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'>): Promise<string> {
  try {
    const now = serverTimestamp();
    const docRef = await addDoc(pagesCollection, {
      ...page,
      createdAt: now,
      updatedAt: now,
      publishedAt: page.published ? now : null
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating page:', error);
    throw error;
  }
}

export async function updatePage(id: string, page: Partial<DocPage>): Promise<void> {
  try {
    const updateData: any = {
      ...page,
      updatedAt: serverTimestamp()
    };
    
    // If we're publishing the page for the first time
    if (page.published === true) {
      const currentDoc = await getDoc(doc(pagesCollection, id));
      const currentData = currentDoc.data();
      
      if (currentData && !currentData.published) {
        updateData.publishedAt = serverTimestamp();
      }
    }
    
    await updateDoc(doc(pagesCollection, id), updateData);
  } catch (error) {
    console.error('Error updating page:', error);
    throw error;
  }
}

export async function deletePage(id: string): Promise<void> {
  try {
    await deleteDoc(doc(pagesCollection, id));
  } catch (error) {
    console.error('Error deleting page:', error);
    throw error;
  }
}
