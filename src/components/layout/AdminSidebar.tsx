
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, FolderTree, Users, Settings } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function AdminSidebar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };
  
  const navItems = [
    { 
      icon: <LayoutDashboard className="w-5 h-5" />, 
      label: 'Dashboard', 
      path: '/admin' 
    },
    { 
      icon: <FileText className="w-5 h-5" />, 
      label: 'Documents', 
      path: '/admin/documents' 
    },
    { 
      icon: <FolderTree className="w-5 h-5" />, 
      label: 'Categories', 
      path: '/admin/categories' 
    },
    { 
      icon: <Users className="w-5 h-5" />, 
      label: 'Admins', 
      path: '/admin/admins' 
    },
    { 
      icon: <Settings className="w-5 h-5" />, 
      label: 'Settings', 
      path: '/admin/settings' 
    },
  ];
  
  return (
    <aside className="w-64 border-r h-screen sticky top-0 sidebar bg-sidebar">
      <div className="p-4 h-16 flex items-center border-b">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="bg-doc-purple text-white p-1 rounded">NL</div>
          <span className="font-bold text-lg">Admin</span>
        </Link>
      </div>
      
      <nav className="py-4 px-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-md mb-1 ${
              isActive(item.path)
                ? 'bg-sidebar-accent text-sidebar-primary'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <Separator className="my-4" />
      
      <div className="px-4 py-2">
        <Link 
          to="/" 
          className="flex items-center gap-3 px-3 py-2 text-sidebar-foreground hover:text-sidebar-foreground rounded-md"
        >
          <span>← Back to Docs</span>
        </Link>
      </div>
    </aside>
  );
}
