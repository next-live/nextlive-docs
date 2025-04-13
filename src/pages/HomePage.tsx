
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
      <section className="py-20 px-4 text-center bg-gradient-to-b from-white to-doc-light-purple dark:from-doc-dark-bg dark:to-doc-dark-bg">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-doc-purple to-blue-500 bg-clip-text text-transparent animate-fade-in">
            NextLive Documentation
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Build real-time, interactive applications with our powerful framework.
            Comprehensive guides, API references, and examples to get you started.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg">
              <Link to="/docs">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="https://github.com/nextlive/docs" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </section>
      
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold mb-4">Quick Installation</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Get up and running in minutes with our simple installation process.
            </p>
            <div className="max-w-2xl mx-auto mb-8">
              <CodeBlock code={installCode} language="bash" />
            </div>
            <div className="max-w-2xl mx-auto">
              <CodeBlock code={usageCode} language="tsx" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center mb-12">Browse Documentation</h2>
          
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
      
      <section className="py-16 px-4 bg-doc-light-purple/30 dark:bg-doc-purple/10">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to build with NextLive?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of developers building amazing applications with our platform.
          </p>
          <Button asChild size="lg">
            <Link to="/docs/getting-started">
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
