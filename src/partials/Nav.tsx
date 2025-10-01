import { Link } from "react-router-dom";
import { singleMenuPosition } from "../extras/interfaces";

interface NavProps {
  menu: singleMenuPosition[];
}

const Nav = ({ menu }: NavProps) => {
  return (
    <nav>
      <ul>
        {menu.map((item, idx) => (
          <li key={idx}>
            <Link to={item.link}>
              <span>{item.text}</span>
              {item.icon}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;
