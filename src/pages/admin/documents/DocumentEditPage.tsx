
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DocumentForm } from '@/components/admin/DocumentForm';
import { getPage, updatePage, createPage } from '@/services/documentationService';
import { DocPage } from '@/types/documentation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function DocumentEditPage() {
  const { id } = useParams<{ id: string }>();
  const isNewDocument = id === 'new';
  const [document, setDocument] = useState<DocPage | null>(null);
  const [isLoading, setIsLoading] = useState(!isNewDocument);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    async function loadDocument() {
      if (isNewDocument) return;
      
      try {
        setIsLoading(true);
        const doc = await getPage(id!);
        
        if (!doc) {
          toast({
            title: "Document not found",
            description: "The document you're looking for doesn't exist.",
            variant: "destructive"
          });
          navigate('/admin/documents');
          return;
        }
        
        setDocument(doc);
      } catch (error) {
        console.error('Error loading document:', error);
        toast({
          title: "Error",
          description: "Failed to load document.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadDocument();
  }, [id, isNewDocument, navigate, toast]);
  
  const handleSubmit = async (formData: Partial<DocPage>) => {
    try {
      setIsSaving(true);
      
      if (isNewDocument) {
        // Create new document
        const newId = await createPage(formData as Omit<DocPage, 'id' | 'createdAt' | 'updatedAt'>);
        toast({
          title: "Document Created",
          description: "Your document has been created successfully."
        });
        navigate(`/admin/documents/${newId}`);
      } else {
        // Update existing document
        await updatePage(id!, formData);
        toast({
          title: "Document Updated",
          description: "Your changes have been saved successfully."
        });
        // Refresh the document data
        const updatedDoc = await getPage(id!);
        setDocument(updatedDoc);
      }
    } catch (error) {
      console.error('Error saving document:', error);
      toast({
        title: "Error",
        description: "Failed to save document.",
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
          {isNewDocument ? "Create Document" : "Edit Document"}
        </h1>
      </div>
      
      <DocumentForm
        initialData={document || undefined}
        onSubmit={handleSubmit}
        isLoading={isSaving}
      />
    </div>
  );
}
