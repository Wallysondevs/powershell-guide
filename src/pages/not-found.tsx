import { Terminal } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card/50 border border-border rounded-2xl p-8 text-center backdrop-blur-sm">
        <Terminal className="h-16 w-16 text-destructive mx-auto mb-6 opacity-80" />
        <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">404</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Comando não reconhecido. A página que você está procurando não existe.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          Voltar para o Início
        </Link>
      </div>
    </div>
  );
}
