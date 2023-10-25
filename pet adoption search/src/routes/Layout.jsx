import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <nav>
        <ul>
          <button className="home-link" key="home-button">
            <Link to="/" className="no_underline">
              Home
            </Link>
          </button>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default Layout;