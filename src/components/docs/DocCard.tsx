
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
        "glass-card group flex flex-col h-full p-6 transition-all hover:shadow-[0_8px_30px_rgba(155,135,245,0.15)] border border-white/20 dark:border-white/10 hover:border-doc-purple/30",
        className
      )}
    >
      {icon && (
        <div className="mb-4 p-2 w-fit rounded-lg bg-doc-purple/10 text-doc-purple">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-medium text-foreground mb-2 group-hover:text-doc-purple transition-colors">
        {title}
      </h3>
      <p className="text-muted-foreground flex-grow mb-4">{description}</p>
      <div className="flex items-center text-doc-purple font-medium mt-auto">
        <span>Learn more</span>
        <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
