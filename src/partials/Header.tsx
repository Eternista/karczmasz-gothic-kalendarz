import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";
import LazyImage from "../components/Single/LazyImage"; 
import logo from "../assets/logo.png";

const menuList = [
  {
    name: "O mnie",
    nameEn: "About",
    link: "#about",
  },
  {
    name: "Narzędzia",
    nameEn: "Tech Stack",
    link: "#techstack",
  },
  {
    name: "Projekty",
    nameEn: "Projects",
    link: "#projects",
  },
  {
    name: "Opinie",
    nameEn: "Testimonials",
    link: "#testimonials",
  },
];

const styleContainer = {
  button: "text-xl transition-all text-bold text-white hover:text-primary",
};

const Header = () => {
  const { i18n } = useTranslation();
  const [acLang, setAcLang] = useState<string>(i18n.language);
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setAcLang(lang);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0); // Check if the user has scrolled
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll); // Cleanup on unmount
    };
  }, []);

  useEffect(() => {
    // When the menu is open, disable scrolling on the page.
    document.documentElement.style.overflowY = isOpen ? "hidden" : "auto";

    // Cleanup function to ensure scrolling is re-enabled when the component unmounts.
    return () => {
      document.documentElement.style.overflowY = "auto";
    };
  }, [isOpen]);

  return (
    <>
      <header
        className={`w-full fixed top-0 left-0 z-30 p-6 transition-colors duration-300 ${
          scrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <menu className="flex items-center justify-between">
          <a href="#home">
            <LazyImage classes="w-24" src={logo} alt="logo" />
          </a>
          <div className="flex items-center w-fit">
            <ul className="lg:flex hidden items-center gap-8 mr-8 w-fit justify-between">
              {menuList.map((item, menuIndex) => (
                <li key={menuIndex}>
                  <a
                    className="text-uppercase text-white text-lg"
                    href={item.link}
                  >
                    {acLang === "en" ? item.nameEn : item.name}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#contact"
                  className="w-36 text-center bg-primary px-4 py-3 rounded-[40px] transition-colors duration-300 hover:bg-secondary group"
                >
                  <span className="text-lg text-black font-extrabold transition-colors duration-300 group-hover:text-white">
                    {acLang === "en" ? "Contact" : "Kontakt"}
                  </span>
                </a>
              </li>
            </ul>
            {acLang === "en" ? (
              <button
                className={styleContainer.button}
                onClick={() => {
                  changeLanguage("pl");
                }}
              >
                PL
              </button>
            ) : (
              <button
                className={styleContainer.button}
                onClick={() => {
                  changeLanguage("en");
                }}
              >
                EN
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="block ml-5 lg:hidden text-white hover:bg-gray-700"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </menu>
      </header>
      <menu
        className={`lg:hidden flex justify-center items-center transition-all fixed top-0 w-full h-full bg-black/80 backdrop-blur-md ${isOpen ? "left-0" : "left-full"}`}
      >
        <ul className="flex flex-col items-center gap-8 mr-8 w-fit justify-between">
          {menuList.map((item, menuIndex) => (
            <li key={menuIndex}>
              <a className="text-uppercase text-white text-lg" href={item.link}>
                {acLang === "en" ? item.nameEn : item.name}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="w-36 text-center bg-primary px-4 py-3 rounded-[40px] transition-colors duration-300 hover:bg-secondary group"
            >
              <span className="text-lg text-black font-extrabold transition-colors duration-300 group-hover:text-white">
                {acLang === "en" ? "Contact" : "Kontakt"}
              </span>
            </a>
          </li>
        </ul>
      </menu>
    </>
  );
};

export default Header;
