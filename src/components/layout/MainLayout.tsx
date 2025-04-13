
import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { DocSidebar } from './DocSidebar';
import { getCategoriesWithPages } from '@/services/documentationService';
import { DocCategoryWithPages } from '@/types/documentation';

export function MainLayout() {
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const [docCategories, setDocCategories] = useState<DocCategoryWithPages[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const isDocPage = location.pathname.startsWith('/docs');
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  useEffect(() => {
    if (isDocPage) {
      fetchDocCategories();
    }
  }, [isDocPage]);
  
  const fetchDocCategories = async () => {
    try {
      setIsLoading(true);
      const categories = await getCategoriesWithPages(true);
      setDocCategories(categories);
    } catch (error) {
      console.error('Error fetching doc categories:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleTheme = () => {
    setIsDark(!isDark);
    
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50/30 to-blue-50/30 dark:from-purple-900/10 dark:to-blue-900/10">
      <div className="fixed inset-0 bg-[url('/subtle-pattern.png')] opacity-5 pointer-events-none z-0"></div>
      <Header 
        toggleTheme={toggleTheme} 
        isDark={isDark} 
        toggleSidebar={toggleSidebar}
        isMobile={isMobile && isDocPage}
      />
      
      <div className="flex flex-1 relative z-10">
        {isDocPage && !isMobile && (
          <aside className="w-64 min-h-[calc(100vh-4rem)] sticky top-16 shrink-0 overflow-y-auto glass-surface ml-4 mt-4 px-4">
            <DocSidebar categories={docCategories} isLoading={isLoading} />
          </aside>
        )}
        
        {isDocPage && isMobile && (
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="w-64 p-0 glass-surface">
              <div className="p-4 overflow-y-auto h-full">
                <DocSidebar categories={docCategories} isLoading={isLoading} />
              </div>
            </SheetContent>
          </Sheet>
        )}
        
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
