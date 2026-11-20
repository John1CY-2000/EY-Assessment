import { useState } from "react";
import CertificateForm from "./components/CertificateForm";
import RequestsTable from "./components/RequestsTable";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("request");

  return (
    <div className="app">
      <header className="app-header">
        <h1>Zalex Employee Certificates</h1>
        <p>Employee Certificate Management System</p>
      </header>

      <nav className="navigation" aria-label="Main navigation">
        <button
          className={activePage === "request" ? "active" : ""}
          onClick={() => setActivePage("request")}
          aria-pressed={activePage === "request"}
        >
          Request Certificate
        </button>

        <button
          className={activePage === "list" ? "active" : ""}
          onClick={() => setActivePage("list")}
          aria-pressed={activePage === "list"}
        >
          Requests List
        </button>
      </nav>

      <main className="main-content">
        {activePage === "request" ? (
          <CertificateForm />
        ) : (
          <RequestsTable />
        )}
      </main>
    </div>
  );
}

export default App;