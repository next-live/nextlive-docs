
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CategoryForm } from '@/components/admin/CategoryForm';
import { getCategory, updateCategory, createCategory } from '@/services/documentationService';
import { DocCategory } from '@/types/documentation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function CategoryEditPage() {
  const { id } = useParams<{ id: string }>();
  const isNewCategory = id === 'new';
  const [category, setCategory] = useState<DocCategory | null>(null);
  const [isLoading, setIsLoading] = useState(!isNewCategory);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    async function loadCategory() {
      if (isNewCategory) return;
      
      try {
        setIsLoading(true);
        const cat = await getCategory(id!);
        
        if (!cat) {
          toast({
            title: "Category not found",
            description: "The category you're looking for doesn't exist.",
            variant: "destructive"
          });
          navigate('/admin/categories');
          return;
        }
        
        setCategory(cat);
      } catch (error) {
        console.error('Error loading category:', error);
        toast({
          title: "Error",
          description: "Failed to load category.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadCategory();
  }, [id, isNewCategory, navigate, toast]);
  
  const handleSubmit = async (formData: Partial<DocCategory>) => {
    try {
      setIsSaving(true);
      
      if (isNewCategory) {
        // Create new category
        const newId = await createCategory(formData as Omit<DocCategory, 'id'>);
        toast({
          title: "Category Created",
          description: "Your category has been created successfully."
        });
        navigate(`/admin/categories/${newId}`);
      } else {
        // Update existing category
        await updateCategory(id!, formData);
        toast({
          title: "Category Updated",
          description: "Your changes have been saved successfully."
        });
        // Refresh the category data
        const updatedCat = await getCategory(id!);
        setCategory(updatedCat);
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "Error",
        description: "Failed to save category.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container p-6 flex items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container p-6 max-w-7xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">
          {isNewCategory ? "Create Category" : "Edit Category"}
        </h1>
      </div>
      
      <CategoryForm
        initialData={category || undefined}
        onSubmit={handleSubmit}
        isLoading={isSaving}
      />
    </div>
  );
}
