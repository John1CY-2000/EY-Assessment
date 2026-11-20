
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

  const [filters, setFilters] = useState({
    reference_no: "",
    address_to: "",
    status: "",
  });

  const availableStatuses = [
    ...new Set(
        requests
        .map((request) => request.status)
        .filter(Boolean)
    ),
  ].sort();

  function handleSort(field) {
    setSortConfig((previous) => ({
        field,
        direction:
        previous.field === field && previous.direction === "asc"
            ? "desc"
            : "asc",
    }));
  }

  function handleFilterChange(event) {
    const { name, value } = event.target;

    setFilters((previous) => ({
        ...previous,
        [name]: value,
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

  const filteredRequests = requests.filter((request) => {
    const matchesReference =
        !filters.reference_no ||
        String(request.reference_no) === filters.reference_no.trim();

    const matchesAddress =
        !filters.address_to ||
        (request.address_to ?? "")
        .toLowerCase()
        .includes(filters.address_to.trim().toLowerCase());

    const matchesStatus =
        !filters.status ||
        request.status === filters.status;

    return matchesReference && matchesAddress && matchesStatus;
  });

    const sortedRequests = [...filteredRequests].sort((a, b) => {
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

            <div className="table-filters">
                <div className="form-field">
                    <label htmlFor="filter-reference">Reference No.</label>
                    <input
                    id="filter-reference"
                    type="text"
                    name="reference_no"
                    value={filters.reference_no}
                    onChange={handleFilterChange}
                    placeholder="Search reference..."
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="filter-address">Address to</label>
                    <input
                    id="filter-address"
                    type="text"
                    name="address_to"
                    value={filters.address_to}
                    onChange={handleFilterChange}
                    placeholder="Search address..."
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="filter-status">Status</label>
                    <select
                        id="filter-status"
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        >
                        <option value="">All statuses</option>

                        {availableStatuses.map((status) => (
                            <option key={status} value={status}>
                            {status}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

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
          {requests.length > 0 && filteredRequests.length === 0 && (
            <p role="status">
                No requests match the selected filters.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

export default RequestsTable;
