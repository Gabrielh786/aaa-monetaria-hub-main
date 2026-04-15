export default function StoreFooter() {
  return (
    <footer className="bg-primary text-primary-foreground py-8 mt-12">
      <div className="container text-center text-sm">
        <p className="font-display text-lg tracking-wide mb-2">A.A.A. MONETÁRIA UFU</p>
        <p className="text-primary-foreground/60">© {new Date().getFullYear()} Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
