import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

function DeveloperLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Topbar />

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DeveloperLayout;