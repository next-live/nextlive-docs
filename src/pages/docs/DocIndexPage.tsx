
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCategoriesWithPages } from '@/services/documentationService';
import { DocCategoryWithPages } from '@/types/documentation';

export default function DocIndexPage() {
  const [categories, setCategories] = useState<DocCategoryWithPages[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function loadCategories() {
      try {
        setIsLoading(true);
        const fetchedCategories = await getCategoriesWithPages(true);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadCategories();
  }, []);
  
  return (
    <div className="container py-10 max-w-4xl">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4">Documentation</h1>
        <p className="text-xl text-muted-foreground">
          Welcome to the NextLive documentation. Find everything you need to build amazing applications.
        </p>
      </div>
      
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
        <p className="text-muted-foreground mb-6">
          Learn the basics of NextLive and start building your first application.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link 
            to="/docs/getting-started/installation" 
            className="doc-card group flex flex-col"
          >
            <h3 className="text-lg font-medium group-hover:text-doc-purple">Installation Guide</h3>
            <p className="text-sm text-muted-foreground flex-grow">
              Learn how to install NextLive in your project
            </p>
            <div className="flex items-center text-doc-purple text-sm font-medium mt-2">
              <span>Read More</span>
              <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
          
          <Link 
            to="/docs/getting-started/quick-start" 
            className="doc-card group flex flex-col"
          >
            <h3 className="text-lg font-medium group-hover:text-doc-purple">Quick Start</h3>
            <p className="text-sm text-muted-foreground flex-grow">
              Get up and running quickly with NextLive
            </p>
            <div className="flex items-center text-doc-purple text-sm font-medium mt-2">
              <span>Read More</span>
              <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
      
      <div className="space-y-10">
        {categories.map((category) => (
          <div key={category.id} className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{category.title}</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/docs/${category.slug}`}>
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <p className="text-muted-foreground mb-6">
              {category.description || `Documentation and guides for ${category.title}`}
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {category.pages.slice(0, 4).map((page) => (
                <Link
                  key={page.id}
                  to={`/docs/${category.slug}/${page.slug}`}
                  className="doc-card group flex flex-col"
                >
                  <h3 className="text-lg font-medium group-hover:text-doc-purple">{page.title}</h3>
                  <div className="flex items-center text-doc-purple text-sm font-medium mt-2">
                    <span>Read More</span>
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
