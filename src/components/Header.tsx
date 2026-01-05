const Header = () => {
  return (
    <header className="text-center py-8 px-4">
      <div className="inline-flex items-center gap-3 mb-3">
        <span className="text-5xl animate-bounce-subtle">🍌</span>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-amber-500 to-primary bg-clip-text text-transparent">
          Ripeness Detector 3000
        </h1>
        <span className="text-5xl animate-bounce-subtle" style={{ animationDelay: "0.5s" }}>🍌</span>
      </div>
      <p className="text-muted-foreground text-lg max-w-md mx-auto">
        Upload a photo of bananas and let AI detect their ripeness level
      </p>
    </header>
  );
};

export default Header;
