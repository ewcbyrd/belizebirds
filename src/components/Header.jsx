const Header = () => {
  // Use correct base path for GitHub Pages
  const basePath = import.meta.env.BASE_URL;
  
  return (
    <header 
      className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] bg-cover bg-center"
      style={{ backgroundImage: `url(${basePath}hero-banner.jpg)` }}
    >
      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
      
      {/* Text content - centered */}
      <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2 drop-shadow-2xl">
          Belize Birds
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium drop-shadow-lg">
          Learn the birds of Belize
        </p>
      </div>
    </header>
  );
};

export default Header;
