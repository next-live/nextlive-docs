
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { DocCategoryWithPages } from '@/types/documentation';
import { Skeleton } from '@/components/ui/skeleton';

interface DocSidebarProps {
  categories: DocCategoryWithPages[];
  isLoading?: boolean;
}

export function DocSidebar({ categories, isLoading = false }: DocSidebarProps) {
  const location = useLocation();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
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
  
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
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
          className={`block py-2 px-2 rounded-md ${location.pathname === '/docs' ? 'bg-doc-light-purple text-doc-purple' : 'text-muted-foreground hover:text-foreground hover:bg-background'}`}
        >
          Introduction
        </Link>
      </div>
      
      {categories.map((category) => (
        <div key={category.id} className="mb-4">
          <button
            onClick={() => toggleCategory(category.id)}
            className="flex items-center justify-between w-full text-left font-medium py-2 px-2 rounded-md hover:bg-accent"
          >
            <span>{category.title}</span>
            {expandedCategories[category.id] ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {expandedCategories[category.id] && (
            <div className="ml-2 pl-2 border-l mt-1 space-y-1">
              {category.pages.map((page) => (
                <Link
                  key={page.id}
                  to={`/docs/${category.slug}/${page.slug}`}
                  className={`block py-1 px-2 text-sm rounded-md ${location.pathname === `/docs/${category.slug}/${page.slug}` ? 'bg-doc-light-purple text-doc-purple' : 'text-muted-foreground hover:text-foreground hover:bg-background'}`}
                >
                  {page.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
