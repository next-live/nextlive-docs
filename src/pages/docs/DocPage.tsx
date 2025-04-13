
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPageBySlug, getCategoryBySlug } from '@/services/documentationService';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocPage as DocPageType } from '@/types/documentation';
import ReactMarkdown from 'react-markdown';
import { CodeBlock } from '@/components/docs/CodeBlock';

export default function DocPage() {
  const { categorySlug, pageSlug } = useParams<{ categorySlug: string; pageSlug: string }>();
  const [page, setPage] = useState<DocPageType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    async function loadPage() {
      if (!categorySlug || !pageSlug) {
        setError('Invalid page URL');
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        const fetchedPage = await getPageBySlug(categorySlug, pageSlug);
        
        if (!fetchedPage) {
          setError('Page not found');
          setIsLoading(false);
          return;
        }
        
        setPage(fetchedPage);
      } catch (error) {
        console.error('Error loading page:', error);
        setError('Failed to load page');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadPage();
  }, [categorySlug, pageSlug]);
  
  if (isLoading) {
    return (
      <div className="container py-10 max-w-4xl">
        <Skeleton className="h-10 w-3/4 mb-4" />
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container py-10 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => navigate('/docs')}>Back to Documentation</Button>
      </div>
    );
  }
  
  if (!page) {
    return null;
  }
  
  return (
    <div className="container py-10 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
      
      {(page.updatedAt || page.publishedAt) && (
        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
          {page.updatedAt && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Updated: {page.updatedAt.toLocaleDateString()}</span>
            </div>
          )}
          {page.publishedAt && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Published: {page.publishedAt.toLocaleDateString()}</span>
            </div>
          )}
        </div>
      )}
      
      <div className="prose dark:prose-invert max-w-none mb-12">
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <CodeBlock
                  code={String(children).replace(/\n$/, '')}
                  language={match[1]}
                />
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {page.content}
        </ReactMarkdown>
      </div>
      
      <div className="flex items-center justify-between pt-6 border-t">
        <Button variant="ghost" asChild>
          <a href="#" onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </a>
        </Button>
        
        <Button variant="ghost" asChild>
          <a href="#" onClick={(e) => {
            e.preventDefault();
            // This would need logic to get next page
            navigate('/docs');
          }}>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
