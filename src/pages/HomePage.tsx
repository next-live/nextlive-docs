
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { DocCard } from '@/components/docs/DocCard';
import { Book, FileCode, Github, ArrowRight, Box, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCategories } from '@/services/documentationService';
import { DocCategory } from '@/types/documentation';

const installCode = `# Using npm
npm install @nextlive/core

# Using yarn
yarn add @nextlive/core

# Using pnpm
pnpm add @nextlive/core`;

const usageCode = `import { NextLiveApp } from '@nextlive/core';

function App() {
  return (
    <NextLiveApp
      apiKey="your-api-key"
      projectId="your-project-id"
    >
      <YourAwesomeApp />
    </NextLiveApp>
  );
}`;

export default function HomePage() {
  const [categories, setCategories] = useState<DocCategory[]>([]);
  
  useEffect(() => {
    async function loadCategories() {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories.slice(0, 3)); // Get first 3 categories
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    }
    
    loadCategories();
  }, []);
  
  return (
    <>
      <section className="py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/40 to-blue-50/40 dark:from-purple-900/20 dark:to-blue-900/20 z-0"></div>
        <div className="absolute -top-[40%] -right-[10%] w-[70%] h-[70%] rounded-full bg-purple-200/30 dark:bg-purple-900/20 blur-3xl"></div>
        <div className="absolute -bottom-[40%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-200/30 dark:bg-blue-900/20 blur-3xl"></div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="glass-card glass-shine p-10">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-gradient animate-fade-in">
              NextLive Documentation
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Build real-time, interactive applications with our powerful framework.
              Comprehensive guides, API references, and examples to get you started.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild size="lg" className="glass-button">
                <Link to="/docs">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="glass-button">
                <a href="https://github.com/nextlive/docs" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold mb-4 text-gradient">Quick Installation</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Get up and running in minutes with our simple installation process.
            </p>
            <div className="max-w-2xl mx-auto mb-8 glass-card p-4">
              <CodeBlock code={installCode} language="bash" />
            </div>
            <div className="max-w-2xl mx-auto glass-card p-4">
              <CodeBlock code={usageCode} language="tsx" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center mb-12 text-gradient">Browse Documentation</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(category => (
              <DocCard
                key={category.id}
                title={category.title}
                description={category.description || `Documentation and guides for ${category.title}`}
                link={`/docs/${category.slug}`}
                icon={<Book className="h-6 w-6" />}
              />
            ))}
            
            <DocCard
              title="API Reference"
              description="Detailed API documentation for NextLive components and functions."
              link="/docs/api"
              icon={<FileCode className="h-6 w-6" />}
            />
            
            <DocCard
              title="Examples"
              description="Code examples for common use cases and patterns."
              link="/docs/examples"
              icon={<Github className="h-6 w-6" />}
            />
            
            <DocCard
              title="Video Tutorials"
              description="Step-by-step video guides to help you master NextLive."
              link="/docs/tutorials"
              icon={<Zap className="h-6 w-6" />}
            />
          </div>
        </div>
      </section>
      
      <section className="py-16 px-4 relative z-10 overflow-hidden">
        <div className="absolute -top-[20%] right-[30%] w-[40%] h-[40%] rounded-full bg-purple-200/20 dark:bg-purple-900/20 blur-3xl"></div>
        <div className="absolute -bottom-[20%] left-[30%] w-[40%] h-[40%] rounded-full bg-blue-200/20 dark:bg-blue-900/20 blur-3xl"></div>
        
        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <div className="glass-card glass-shine p-10">
            <h2 className="text-3xl font-bold mb-4 text-gradient">Ready to build with NextLive?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of developers building amazing applications with our platform.
            </p>
            <Button asChild size="lg" className="glass-button">
              <Link to="/docs/getting-started">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
