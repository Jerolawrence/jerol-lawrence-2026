import { Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { Code2 } from "lucide-react";
import { useSiteContacts } from "@/hooks/use-site-data";

function Icon({ name, className }: { name: string | null; className?: string }) {
  const Cmp = (name && (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name]) || Icons.Link2;
  return <Cmp className={className} />;
}

export function Footer() {
  const contacts = useSiteContacts("footer");

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="flex items-center gap-2 font-heading text-lg font-bold tracking-tight text-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Code2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span>Jerol Lawrence</span>
          </div>

          <nav className="flex items-center gap-6">
            <Link to="/about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">About</Link>
            <Link to="/projects" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Projects</Link>
            <Link to="/skills" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Skills</Link>
            <Link to="/contact" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Contact</Link>
          </nav>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {contacts.map((c) => {
              const inner = <Icon name={c.icon} className="h-4 w-4" />;
              const cls = "flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground";
              return c.url ? (
                <a key={c.id} href={c.url} target={c.url.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" title={`${c.label}: ${c.value}`} className={cls}>
                  {inner}
                </a>
              ) : (
                <span key={c.id} title={`${c.label}: ${c.value}`} className={cls}>{inner}</span>
              );
            })}
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Jerol Lawrence. All rights reserved. Built with modern web technologies.
          </p>
        </div>
      </div>
    </footer>
  );
}
