const Header = () => {
  return (
    <header 
      className="relative w-full h-[200px] md:h-[300px] bg-cover bg-center"
      style={{ backgroundImage: 'url(/hero-banner.jpg)' }}
    >
      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
      
      {/* Text content */}
      <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-shadow-lg drop-shadow-lg">
          Belize Birds
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl font-medium drop-shadow-md">
          Learn the birds of Belize
        </p>
      </div>
    </header>
  );
};

export default Header;
