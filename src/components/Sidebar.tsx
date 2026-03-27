import { useState, useEffect } from 'react';
import { Section } from '@/data/powershell';
import { Terminal, Search, ChevronRight, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  sections: Section[];
  activeSection: string;
  onSearch: (term: string) => void;
  searchTerm: string;
}

export function Sidebar({ sections, activeSection, onSearch, searchTerm }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on mobile when a link is clicked
  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const SidebarContent = () => (
    <>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <Terminal className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground leading-tight tracking-tight">PowerShell</h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Ultimate Guide</p>
          </div>
        </div>

        <div className="relative mb-8 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="search"
            className="block w-full pl-10 pr-3 py-2.5 bg-background/50 border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner"
            placeholder="Buscar comandos..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <nav className="space-y-1">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">
            Navegação
          </h2>
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group",
                  isActive
                    ? "bg-primary/10 text-primary font-medium shadow-sm border border-primary/20"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
                )}
              >
                <span className="truncate">{section.title}</span>
                <ChevronRight 
                  size={14} 
                  className={cn(
                    "transition-transform",
                    isActive ? "text-primary opacity-100" : "opacity-0 group-hover:opacity-50 -translate-x-2 group-hover:translate-x-0"
                  )} 
                />
              </a>
            );
          })}
        </nav>
      </div>
      
      <div className="mt-auto p-6 border-t border-border/50">
        <p className="text-xs text-muted-foreground text-center">
          Terminal Inspired Design <br/> © {new Date().getFullYear()} Replit Agent
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 p-3 bg-card border border-border rounded-full shadow-lg lg:hidden text-foreground hover:bg-secondary transition-colors"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-card/95 backdrop-blur-xl border-r border-border/50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </div>
    </>
  );
}
