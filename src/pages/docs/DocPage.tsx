
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPageBySlug } from '@/services/documentationService';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight, Clock, Calendar, FileText, AlertTriangle, Home } from 'lucide-react';
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
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 text-destructive mb-4">
            <AlertTriangle className="h-6 w-6" />
            <h1 className="text-3xl font-bold">Error</h1>
          </div>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => navigate('/docs')} className="glass-button flex items-center gap-2">
            <Home className="h-4 w-4" />
            Back to Documentation
          </Button>
        </div>
      </div>
    );
  }
  
  if (!page) {
    return null;
  }
  
  return (
    <div className="container py-10 max-w-4xl">
      <div className="glass-card glass-shine p-8 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="h-8 w-8 text-doc-purple" />
          <h1 className="text-4xl font-bold text-gradient">{page.title}</h1>
        </div>
        
        {(page.updatedAt || page.publishedAt) && (
          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
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
      </div>
      
      <div className="glass-card p-8 mb-8">
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown
            components={{
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !match ? (
                  <code className={className} {...props}>
                    {children}
                  </code>
                ) : (
                  <CodeBlock
                    code={String(children).replace(/\n$/, '')}
                    language={match[1]}
                  />
                );
              },
            }}
          >
            {page.content}
          </ReactMarkdown>
        </div>
      </div>
      
      <div className="glass-card p-6 flex items-center justify-between">
        <Button variant="ghost" asChild className="glass-button flex items-center">
          <a href="#" onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </a>
        </Button>
        
        <Button variant="ghost" asChild className="glass-button flex items-center">
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
