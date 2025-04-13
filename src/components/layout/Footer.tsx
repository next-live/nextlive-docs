
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t py-12 mt-auto">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-doc-purple text-white p-1 rounded">NL</div>
            <span className="font-bold text-lg">NextLive Docs</span>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Build better applications with NextLive - the modern app framework.
          </p>
        </div>
        
        <div>
          <h3 className="font-medium mb-3">Documentation</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/docs/getting-started" className="text-muted-foreground hover:text-foreground">Getting Started</Link></li>
            <li><Link to="/docs/installation" className="text-muted-foreground hover:text-foreground">Installation</Link></li>
            <li><Link to="/docs/api" className="text-muted-foreground hover:text-foreground">API Reference</Link></li>
            <li><Link to="/docs/examples" className="text-muted-foreground hover:text-foreground">Examples</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium mb-3">Community</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="text-muted-foreground hover:text-foreground">GitHub</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-foreground">Discord</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-foreground">Twitter</a></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium mb-3">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="container mt-8 pt-8 border-t">
        <p className="text-sm text-muted-foreground text-center">
          © {currentYear} NextLive. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
