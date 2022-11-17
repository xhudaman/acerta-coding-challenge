import { Link, Outlet } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex flex-col">
      <header>
        <nav className="flex bg-gray-400 p-4 justify-between">
          <Link to="/customers">
            <h1>Surprise Me fruits Co.</h1>
          </Link>
        </nav>
      </header>
      <main className="flex flex-col justify-center items-center">
        <Outlet />
      </main>
    </div>
  );
};
export default HomePage;
