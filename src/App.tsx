
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { seedAdminUser } from "./services/authService";

import { MainLayout } from "./components/layout/MainLayout";
import { AdminLayout } from "./components/layout/AdminLayout";

import HomePage from "./pages/HomePage";
import DocIndexPage from "./pages/docs/DocIndexPage";
import DocPage from "./pages/docs/DocPage";
import SearchPage from "./pages/SearchPage";
import LoginPage from "./pages/admin/LoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import DocumentsPage from "./pages/admin/documents/DocumentsPage";
import DocumentEditPage from "./pages/admin/documents/DocumentEditPage";
import CategoriesPage from "./pages/admin/categories/CategoriesPage";
import CategoryEditPage from "./pages/admin/categories/CategoryEditPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Initialize admin user on app start
  useEffect(() => {
    seedAdminUser().catch(console.error);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Main Documentation Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="docs" element={<DocIndexPage />} />
              <Route path="docs/:categorySlug/:pageSlug" element={<DocPage />} />
              <Route path="search" element={<SearchPage />} />
            </Route>
            
            {/* Admin Routes */}
            <Route path="admin/login" element={<LoginPage />} />
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="documents" element={<DocumentsPage />} />
              <Route path="documents/:id" element={<DocumentEditPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="categories/:id" element={<CategoryEditPage />} />
            </Route>
            
            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
