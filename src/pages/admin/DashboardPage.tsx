
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { getCategoriesWithPages } from '@/services/documentationService';
import { DocCategoryWithPages } from '@/types/documentation';
import { FileText, FolderTree, Users, Eye, PenSquare, Plus, ChevronRight } from 'lucide-react';

export default function DashboardPage() {
  const [docCategories, setDocCategories] = useState<DocCategoryWithPages[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const categories = await getCategoriesWithPages(false);
        setDocCategories(categories);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, []);
  
  // Calculate stats
  const totalPages = docCategories.reduce(
    (total, category) => total + category.pages.length,
    0
  );
  
  const publishedPages = docCategories.reduce(
    (total, category) => total + category.pages.filter(p => p.published).length,
    0
  );
  
  const draftPages = totalPages - publishedPages;
  
  return (
    <div className="container p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="space-x-2">
          <Button asChild>
            <Link to="/admin/documents/new">
              <Plus className="mr-2 h-4 w-4" />
              New Document
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Documents</CardDescription>
            <CardTitle className="text-4xl">{totalPages}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <FileText className="mr-1 h-4 w-4" />
              <span>Across {docCategories.length} categories</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Published Documents</CardDescription>
            <CardTitle className="text-4xl">{publishedPages}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <Eye className="mr-1 h-4 w-4" />
              <span>Live on the documentation site</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Draft Documents</CardDescription>
            <CardTitle className="text-4xl">{draftPages}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <PenSquare className="mr-1 h-4 w-4" />
              <span>Unpublished drafts</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="content">
        <TabsList className="mb-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="recent">Recently Updated</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Documentation Structure</CardTitle>
              <CardDescription>
                Browse and manage your documentation content
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Separator />
              
              {docCategories.map((category) => (
                <div key={category.id}>
                  <div className="flex justify-between items-center p-4 hover:bg-accent/50">
                    <div className="flex items-center">
                      <FolderTree className="mr-2 h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{category.title}</span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        ({category.pages.length} documents)
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/admin/categories/${category.id}`}>
                        Manage
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="pl-8">
                    {category.pages.slice(0, 3).map((page) => (
                      <div key={page.id}>
                        <div className="flex justify-between items-center p-4 hover:bg-accent/50">
                          <div className="flex items-center">
                            <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                            <span>{page.title}</span>
                            {!page.published && (
                              <span className="ml-2 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                                Draft
                              </span>
                            )}
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/admin/documents/${page.id}`}>Edit</Link>
                          </Button>
                        </div>
                        <Separator />
                      </div>
                    ))}
                    
                    {category.pages.length > 3 && (
                      <div className="p-3 text-center">
                        <Button variant="link" size="sm" asChild>
                          <Link to={`/admin/categories/${category.id}`}>
                            View all {category.pages.length} documents
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recently Updated</CardTitle>
              <CardDescription>
                Documents that were recently created or modified
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Separator />
              
              {/* This would be sorted by updatedAt in a real app */}
              {docCategories.flatMap(category => 
                category.pages.map(page => ({ ...page, category }))
              )
                .sort((a, b) => 
                  (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0)
                )
                .slice(0, 10)
                .map(({ id, title, category, updatedAt, published }) => (
                  <div key={id}>
                    <div className="flex justify-between items-center p-4 hover:bg-accent/50">
                      <div>
                        <div className="flex items-center">
                          <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                          <span>{title}</span>
                          {!published && (
                            <span className="ml-2 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                              Draft
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          <span>In: {category.title}</span>
                          {updatedAt && (
                            <span className="ml-4">
                              Updated: {updatedAt.toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/admin/documents/${id}`}>Edit</Link>
                      </Button>
                    </div>
                    <Separator />
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
