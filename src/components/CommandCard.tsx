import { Command } from '@/data/powershell';
import { CodeBlock } from './CodeBlock';
import { Info } from 'lucide-react';

interface CommandCardProps {
  command: Command;
}

export function CommandCard({ command }: CommandCardProps) {
  return (
    <div className="bg-card/30 border border-border/50 rounded-2xl p-6 md:p-8 hover:bg-card/50 transition-colors duration-300 shadow-lg shadow-black/20">
      <h3 className="text-2xl font-bold text-foreground mb-3 flex items-center gap-3">
        <span className="text-primary">{`>_`}</span>
        {command.name}
      </h3>
      
      <p className="text-muted-foreground mb-6 leading-relaxed">
        {command.description}
      </p>

      {command.syntax && (
        <div className="mb-8">
          <h4 className="text-xs font-bold tracking-wider text-accent uppercase mb-3">Sintaxe</h4>
          <code className="block bg-black/40 px-4 py-3 rounded-lg text-sm text-blue-200 border border-border/50 break-words font-mono">
            {command.syntax}
          </code>
        </div>
      )}

      <div>
        <h4 className="text-xs font-bold tracking-wider text-primary uppercase mb-4">Exemplos Práticos</h4>
        <div className="space-y-6">
          {command.examples.map((ex, idx) => (
            <div key={idx} className="space-y-2">
              <p className="text-sm font-medium text-foreground/90 flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                {ex.desc}
              </p>
              <CodeBlock code={ex.code} />
            </div>
          ))}
        </div>
      </div>

      {command.notes && (
        <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 flex gap-3 items-start">
          <Info className="text-blue-400 mt-0.5 flex-shrink-0" size={18} />
          <p className="text-sm text-blue-200 leading-relaxed">{command.notes}</p>
        </div>
      )}
    </div>
  );
}
