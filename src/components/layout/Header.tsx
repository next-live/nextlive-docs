
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoonIcon, SunIcon, MenuIcon, XIcon, SearchIcon } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  toggleTheme: () => void;
  isDark: boolean;
  toggleSidebar?: () => void;
  isMobile?: boolean;
}

export function Header({ toggleTheme, isDark, toggleSidebar, isMobile }: HeaderProps) {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-200 ${isScrolled ? 'bg-background/95 backdrop-blur-sm shadow-sm' : 'bg-background'}`}>
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="mr-2 md:hidden"
            >
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-doc-purple text-white p-1 rounded">NL</div>
            <span className="font-bold text-lg">NextLive Docs</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <form onSubmit={handleSearch} className="relative w-64">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documentation..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
              Documentation
            </Link>
            <Link to="/api" className="text-muted-foreground hover:text-foreground transition-colors">
              API
            </Link>
            <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
              Admin
            </Link>
          </nav>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
