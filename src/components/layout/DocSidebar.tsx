import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, BookOpen, FileText, BookMarked } from 'lucide-react';
import { DocCategoryWithPages, DocPage } from '@/types/documentation';
import { Skeleton } from '@/components/ui/skeleton';
import { getPagesByCategoryId } from '@/services/documentationService'; // Import the function

interface DocSidebarProps {
  categories: DocCategoryWithPages[];
  isLoading?: boolean;
}

export function DocSidebar({ categories, isLoading = false }: DocSidebarProps) {
  const location = useLocation();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [pagesByCategory, setPagesByCategory] = useState<Record<string, DocPage[]>>({});

  // Auto-expand the category of the current page
  useEffect(() => {
    if (categories.length > 0) {
      const pathParts = location.pathname.split('/');
      if (pathParts.length >= 3 && pathParts[1] === 'docs') {
        const categorySlug = pathParts[2];
        const category = categories.find(c => c.slug === categorySlug);

        if (category) {
          setExpandedCategories(prev => ({
            ...prev,
            [category.id]: true
          }));
        }
      }
    }
  }, [categories, location.pathname]);

  // Fetch pages for a category when it is expanded
  const toggleCategory = async (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));

    // Fetch pages if not already loaded
    if (!pagesByCategory[categoryId]) {
      try {
        const pages = await getPagesByCategoryId(categoryId);
        console.log('Fetched pages:', pages);
        setPagesByCategory(prev => ({
          ...prev,
          [categoryId]: pages
        }));
      } catch (error) {
        console.error('Error fetching pages for category:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="py-2 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-5 w-[80%]" />
            <div className="pl-4 space-y-2">
              <Skeleton className="h-4 w-[70%]" />
              <Skeleton className="h-4 w-[60%]" />
              <Skeleton className="h-4 w-[65%]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <nav className="space-y-1 py-2">
      <div className="mb-4">
        <Link
          to="/docs"
          className={`flex items-center gap-2 py-2 px-2 rounded-md transition-all ${location.pathname === '/docs' ? 'bg-doc-light-purple text-doc-purple' : 'text-muted-foreground hover:text-foreground hover:bg-background'}`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Introduction</span>
        </Link>
      </div>

      {categories.map((category) => (
        <div key={category.id} className="mb-4">
          <button
            onClick={() => toggleCategory(category.id)}
            className="flex items-center justify-between w-full text-left font-medium py-2 px-2 rounded-md hover:bg-accent group transition-all"
          >
            <div className="flex items-center">
              <BookMarked className="h-4 w-4 mr-2 text-doc-purple group-hover:text-doc-purple" />
              <span>{category.title}</span>
            </div>
            {expandedCategories[category.id] ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          {expandedCategories[category.id] && (
            <div className="ml-2 pl-2 border-l border-doc-light-purple/50 mt-1 space-y-1 animate-accordion-down">
              {(pagesByCategory[category.id] || []).map((page) => (
                <Link
                  key={page.id}
                  to={`/docs/${category.slug}/${page.slug}`}
                  className={`flex items-center gap-2 py-1 px-2 text-sm rounded-md transition-colors ${location.pathname === `/docs/${category.slug}/${page.slug}` ? 'bg-doc-light-purple text-doc-purple' : 'text-muted-foreground hover:text-foreground hover:bg-background'}`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>{page.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
