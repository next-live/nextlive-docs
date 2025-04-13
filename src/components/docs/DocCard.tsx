
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  link: string;
  className?: string;
}

export function DocCard({ title, description, icon, link, className }: DocCardProps) {
  return (
    <Link
      to={link}
      className={cn(
        "doc-card group flex flex-col h-full transition-all hover:border-primary",
        className
      )}
    >
      {icon && (
        <div className="mb-4 p-2 w-fit rounded-lg bg-doc-purple/10 text-doc-purple">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-medium text-foreground mb-2 group-hover:text-doc-purple">
        {title}
      </h3>
      <p className="text-muted-foreground flex-grow mb-4">{description}</p>
      <div className="flex items-center text-doc-purple font-medium">
        <span>Learn more</span>
        <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
