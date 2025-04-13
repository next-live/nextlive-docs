
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, FileText } from 'lucide-react';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DocPage, DocCategory } from '@/types/documentation';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  categoryTitle: string;
  categorySlug: string;
  pageSlug: string;
  excerpt: string;
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Record<string, DocCategory>>({});
  
  const form = useForm({
    defaultValues: {
      searchQuery: initialQuery,
    },
  });
  
  // Load categories for display
  useEffect(() => {
    async function loadCategories() {
      const snapshot = await getDocs(collection(db, 'docCategories'));
      const cats: Record<string, DocCategory> = {};
      
      snapshot.forEach(doc => {
        cats[doc.id] = { id: doc.id, ...doc.data() } as DocCategory;
      });
      
      setCategories(cats);
    }
    
    loadCategories();
  }, []);
  
  // Perform search when query changes
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);
  
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    setLoading(true);
    
    try {
      // Simple search by title and content
      const titleQuery = query(
        collection(db, 'docPages'),
        where('title', '>=', searchQuery),
        where('title', '<=', searchQuery + '\uf8ff')
      );
      
      // This is a simple approach - in production, you'd use a proper search solution
      const snapshot = await getDocs(titleQuery);
      
      const searchResults: SearchResult[] = [];
      
      snapshot.forEach(doc => {
        const docData = doc.data() as DocPage;
        const categoryData = categories[docData.categoryId];
        
        if (categoryData && docData.published) {
          // Create excerpt
          let excerpt = docData.content
            .substring(0, 150)
            .replace(/[#*`]/g, '')
            .trim();
            
          if (docData.content.length > 150) {
            excerpt += '...';
          }
          
          searchResults.push({
            id: doc.id,
            title: docData.title,
            content: docData.content,
            categoryId: docData.categoryId,
            categoryTitle: categoryData.title,
            categorySlug: categoryData.slug,
            pageSlug: docData.slug,
            excerpt,
          });
        }
      });
      
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const onSubmit = (data: { searchQuery: string }) => {
    performSearch(data.searchQuery);
  };
  
  return (
    <div className="container py-10 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Search Results</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mb-10">
          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="searchQuery"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search documentation..."
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Search
            </Button>
          </div>
        </form>
      </Form>
      
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : results.length > 0 ? (
          <>
            <p className="text-muted-foreground">
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
            
            <div className="divide-y">
              {results.map((result) => (
                <div key={result.id} className="py-6">
                  <Link
                    to={`/docs/${result.categorySlug}/${result.pageSlug}`}
                    className="flex gap-4 hover:bg-accent/50 rounded-lg p-4 -m-4 transition-colors"
                  >
                    <div className="shrink-0 mt-1">
                      <div className="bg-doc-light-purple text-doc-purple p-2 rounded-md">
                        <FileText className="h-5 w-5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-foreground mb-1">
                        {result.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {result.categoryTitle}
                      </p>
                      <p className="text-muted-foreground">{result.excerpt}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </>
        ) : initialQuery ? (
          <div className="text-center py-10">
            <h3 className="text-xl font-medium mb-2">No results found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search term or browse the documentation categories.
            </p>
          </div>
        ) : (
          <div className="text-center py-10">
            <h3 className="text-xl font-medium mb-2">Enter a search term</h3>
            <p className="text-muted-foreground">
              Search across the NextLive documentation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
