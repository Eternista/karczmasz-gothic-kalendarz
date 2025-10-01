const Footer = () => {
  const actualDate = new Date().getFullYear();

  return (
    <footer className="w-full p-4 text-center">
      <h1>©Copyright {actualDate}</h1>
    </footer>
  );
};

export default Footer;
