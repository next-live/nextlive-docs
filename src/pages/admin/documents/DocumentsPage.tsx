
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPages, getCategories } from '@/services/documentationService';
import { DocPage, DocCategory } from '@/types/documentation';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Eye, 
  EyeOff,
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Plus, 
  Loader2,
  Search,
  FolderTree
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocPage[]>([]);
  const [categories, setCategories] = useState<Record<string, DocCategory>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'category'>('list');
  
  // Group documents by category
  const documentsByCategory: Record<string, DocPage[]> = {};
  
  if (documents.length > 0) {
    documents.forEach(doc => {
      if (!documentsByCategory[doc.categoryId]) {
        documentsByCategory[doc.categoryId] = [];
      }
      documentsByCategory[doc.categoryId].push(doc);
    });
  }
  
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        
        // Load all categories
        const categoriesData = await getCategories();
        const categoriesRecord: Record<string, DocCategory> = {};
        categoriesData.forEach(category => {
          categoriesRecord[category.id] = category;
        });
        setCategories(categoriesRecord);
        
        // Load all documents
        const documentsData = await getPages();
        setDocuments(documentsData);
      } catch (error) {
        console.error('Error loading documents:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, []);
  
  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = categoryFilter === 'all' || doc.categoryId === categoryFilter;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  return (
    <div className="container p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Documents</h1>
        <Button asChild>
          <Link to="/admin/documents/new">
            <Plus className="mr-2 h-4 w-4" />
            New Document
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-72">
          <Select 
            value={categoryFilter} 
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.values(categories).map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List View
          </Button>
          <Button 
            variant={viewMode === 'category' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('category')}
          >
            <FolderTree className="h-4 w-4 mr-2" />
            Category View
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : viewMode === 'list' ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center p-6">
                    {searchTerm || categoryFilter !== 'all' ? 
                      'No documents match your filter criteria' : 
                      'No documents found. Create a new document to get started.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.title}</TableCell>
                    <TableCell>
                      {categories[doc.categoryId]?.title || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {doc.published ? (
                        <Badge className="bg-green-500 hover:bg-green-600">
                          <Eye className="h-3 w-3 mr-1" />
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-slate-400 text-slate-500">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Draft
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {doc.updatedAt?.toLocaleDateString() || 'Never'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/documents/${doc.id}`} className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link 
                              to={`/docs/${categories[doc.categoryId]?.slug || ''}/${doc.slug}`} 
                              target="_blank"
                              className="cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        // Category View
        <div className="border rounded-md p-4">
          <Accordion type="multiple" className="w-full" defaultValue={Object.keys(documentsByCategory)}>
            {Object.entries(documentsByCategory).length === 0 ? (
              <div className="text-center p-6 text-muted-foreground">
                No documents found. Create a new document to get started.
              </div>
            ) : (
              Object.entries(documentsByCategory).map(([categoryId, docs]) => {
                const category = categories[categoryId];
                
                // Filter documents based on search
                const filteredDocs = searchTerm ? 
                  docs.filter(doc => doc.title.toLowerCase().includes(searchTerm.toLowerCase())) : 
                  docs;
                
                // Skip categories with no matching documents when searching
                if (searchTerm && filteredDocs.length === 0) {
                  return null;
                }
                
                // Skip this category if filter is active and doesn't match
                if (categoryFilter !== 'all' && categoryFilter !== categoryId) {
                  return null;
                }
                
                return (
                  <AccordionItem key={categoryId} value={categoryId} className="border-b">
                    <AccordionTrigger className="hover:bg-accent/50 px-4">
                      <div className="flex items-center">
                        <span className="font-medium">{category?.title || 'Unknown Category'}</span>
                        <Badge variant="outline" className="ml-2">
                          {filteredDocs.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pl-6 pr-2 py-2">
                        {filteredDocs.map((doc) => (
                          <div 
                            key={doc.id} 
                            className="flex items-center justify-between p-2 hover:bg-accent/50 rounded-md"
                          >
                            <div className="flex items-center">
                              <span className="font-medium">{doc.title}</span>
                              {doc.published ? (
                                <Badge className="ml-2 bg-green-500 hover:bg-green-600">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Published
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="ml-2 border-slate-400 text-slate-500">
                                  <EyeOff className="h-3 w-3 mr-1" />
                                  Draft
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" asChild>
                                <Link to={`/admin/documents/${doc.id}`}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button variant="ghost" size="icon" asChild>
                                <Link to={`/docs/${category?.slug || ''}/${doc.slug}`} target="_blank">
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })
            )}
          </Accordion>
        </div>
      )}
    </div>
  );
}
