
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Lightbulb, BookOpen, Code, Puzzle, Layers, Settings, BookMarked, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCategoriesWithPages } from '@/services/documentationService';
import { DocCategoryWithPages } from '@/types/documentation';
import { DocCard } from '@/components/docs/DocCard';

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
    <div className="container py-10 max-w-4xl relative z-10">
      <div className="mb-10 glass-card glass-shine p-8">
        <h1 className="text-4xl font-bold mb-4 text-gradient">Documentation</h1>
        <p className="text-xl text-muted-foreground">
          Welcome to the NextLive documentation. Find everything you need to build amazing applications.
        </p>
      </div>
      
      <div className="mb-10 glass-card p-8">
        <h2 className="text-2xl font-bold mb-4 text-gradient flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-doc-purple" />
          Getting Started
        </h2>
        <p className="text-muted-foreground mb-6">
          Learn the basics of NextLive and start building your first application.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link 
            to="/docs/getting-started/installation" 
            className="glass-surface p-6 group flex flex-col hover:shadow-lg transition-all"
          >
            <h3 className="text-lg font-medium group-hover:text-doc-purple flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-doc-purple" />
              Installation Guide
            </h3>
            <p className="text-sm text-muted-foreground flex-grow mt-2">
              Learn how to install NextLive in your project
            </p>
            <div className="flex items-center text-doc-purple text-sm font-medium mt-4">
              <span>Read More</span>
              <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
          
          <Link 
            to="/docs/getting-started/quick-start" 
            className="glass-surface p-6 group flex flex-col hover:shadow-lg transition-all"
          >
            <h3 className="text-lg font-medium group-hover:text-doc-purple flex items-center gap-2">
              <Code className="h-5 w-5 text-doc-purple" />
              Quick Start
            </h3>
            <p className="text-sm text-muted-foreground flex-grow mt-2">
              Get up and running quickly with NextLive
            </p>
            <div className="flex items-center text-doc-purple text-sm font-medium mt-4">
              <span>Read More</span>
              <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
      
      <div className="space-y-10">
        {categories.map((category) => {
          // Pick an icon based on the category title
          let CategoryIcon = BookMarked;
          if (category.title.toLowerCase().includes('component')) CategoryIcon = Puzzle;
          else if (category.title.toLowerCase().includes('api')) CategoryIcon = Code;
          else if (category.title.toLowerCase().includes('guide')) CategoryIcon = BookOpen;
          else if (category.title.toLowerCase().includes('config')) CategoryIcon = Settings;
          else if (category.title.toLowerCase().includes('architecture')) CategoryIcon = Layers;

          return (
            <div key={category.id} className="mb-10 glass-card p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gradient flex items-center gap-2">
                  <CategoryIcon className="h-6 w-6 text-doc-purple" />
                  {category.title}
                </h2>
                <Button variant="ghost" size="sm" asChild className="glass-button">
                  <Link to={`/docs/${category.slug}`} className="flex items-center">
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
                    className="glass-surface p-6 group flex flex-col hover:shadow-lg transition-all"
                  >
                    <h3 className="text-lg font-medium group-hover:text-doc-purple flex items-center gap-2">
                      <FileText className="h-5 w-5 text-doc-purple" />
                      {page.title}
                    </h3>
                    <div className="flex items-center text-doc-purple text-sm font-medium mt-4">
                      <span>Read More</span>
                      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
