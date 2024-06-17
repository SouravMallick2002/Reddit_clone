import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const location = useLocation();

  return (
    <nav className={styles.navbar}>
      <Link className={styles["navbar-brand"]} to="/">
        Reddit
      </Link>
      <div className={styles["navbar-collapse"]} id="navbarSupportedContent">
        <ul className={styles["navbar-nav"]}>
          <li className={styles["nav-item"]}>
            <Link
              className={`${styles["nav-link"]} ${
                location.pathname === "/" ? styles.active : ""
              }`}
              aria-current="page"
              to="/"
            >
              Home
            </Link>
          </li>
          <li className={styles["nav-item"]}>
            <Link
              className={`${styles["nav-link"]} ${
                location.pathname === "/about" ? styles.active : ""
              }`}
              to="/about"
            >
              About
            </Link>
          </li>
          {!localStorage.getItem("token") ? (
            <form className={styles["form-inline"]} role="search">
              <Link
                className={`${styles["nav-link"]} ${
                  location.pathname === "/login" ? styles.active : ""
                }`}
                aria-current="page"
                to="/login"
              >
                Login
              </Link>
              <Link
                className={`${styles["nav-link"]} ${
                  location.pathname === "/register" ? styles.active : ""
                }`}
                aria-current="page"
                to="/register"
              >
                Register
              </Link>
            </form>
          ) : (
            <button onClick={handleLogout} className={styles.btn}>
              Logout
            </button>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
