
import { useEffect, useState } from "react";
import { getCertificateRequests } from "../services/certificateApi";

function getDateSortValue(dateString) {
  const [month, day, year] = dateString.split("/").map(Number);

  return year * 10000 + month * 100 + day;
}

function RequestsTable() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [sortConfig, setSortConfig] = useState({
     field: null,
     direction: "asc",
  });

  function handleSort(field) {
    setSortConfig((previous) => ({
        field,
        direction:
        previous.field === field && previous.direction === "asc"
            ? "desc"
            : "asc",
    }));
  }

  useEffect(() => {
    const controller = new AbortController();

    async function loadRequests() {
      try {
        const data = await getCertificateRequests(controller.signal);
        setRequests(data);
      } catch (error) {
        if (error.name !== "AbortError" && !controller.signal.aborted) {
          setError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadRequests();

    return () => controller.abort();
  }, []);

    const sortedRequests = [...requests].sort((a, b) => {
    if (!sortConfig.field) {
        return 0;
    }

    let comparison = 0;

    if (sortConfig.field === "issued_on") {
        comparison =
        getDateSortValue(a.issued_on) -
        getDateSortValue(b.issued_on);
    } else if (sortConfig.field === "status") {
        comparison = a.status.localeCompare(b.status);
    }

    return sortConfig.direction === "asc"
        ? comparison
        : -comparison;
    });

  return (
    <section>
      <h2>Requests List</h2>
      <p>View your submitted certificate requests.</p>

      {isLoading && <p role="status">Loading requests...</p>}

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {!isLoading && !error && requests.length === 0 && (
        <p>No certificate requests found.</p>
      )}

      {!isLoading && !error && requests.length > 0 && (
        <div className="table-container">
          <table className="requests-table">
            <thead>
              <tr>
                <th>Reference No.</th>
                <th>Address to</th>
                <th>Purpose</th>
                <th
                    scope="col"
                    aria-sort={
                        sortConfig.field === "issued_on"
                        ? sortConfig.direction === "asc"
                            ? "ascending"
                            : "descending"
                        : "none"
                    }
                >
                <button
                    type="button"
                    className="sort-button"
                    onClick={() => handleSort("issued_on")}
                >
                    Issued on{" "}
                    {sortConfig.field === "issued_on"
                    ? sortConfig.direction === "asc" ? "↑" : "↓"
                    : "↕"}
                </button>
                </th>

                <th
                    scope="col"
                    aria-sort={
                        sortConfig.field === "status"
                        ? sortConfig.direction === "asc"
                            ? "ascending"
                            : "descending"
                        : "none"
                    }
                >
                <button
                    type="button"
                    className="sort-button"
                    onClick={() => handleSort("status")}
                >
                    Status{" "}
                    {sortConfig.field === "status"
                    ? sortConfig.direction === "asc" ? "↑" : "↓"
                    : "↕"}
                </button>
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedRequests.map((request, index) => (
                <tr key={index}>
                  <td>{request.reference_no ?? "—"}</td>
                  <td>{request.address_to}</td>
                  <td>{request.purpose}</td>
                  <td>{request.issued_on}</td>
                  <td>{request.status ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default RequestsTable;
