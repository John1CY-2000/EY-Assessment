
import { useState } from "react";

const initialFormData = {
  address_to: "",
  purpose: "",
  issued_on: "",
  employee_id: "",
};

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function validateForm(data) {
  const errors = {};

  if (!data.address_to.trim()) {
    errors.address_to = "Address is required.";
  } else if (!/^[\p{L}\p{N}\s]+$/u.test(data.address_to)) {
    errors.address_to = "Only letters, numbers and spaces are allowed.";
  }

  if (!data.purpose.trim()) {
    errors.purpose = "Purpose is required.";
  } else if (data.purpose.trim().length < 50) {
    errors.purpose = "Purpose must contain at least 50 characters.";
  }

  if (!data.issued_on) {
    errors.issued_on = "Issue date is required.";
  } else {
    const selectedDate = new Date(`${data.issued_on}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      errors.issued_on = "Please select a future date.";
    }
  }

  if (!data.employee_id.trim()) {
    errors.employee_id = "Employee ID is required.";
  } else if (!/^\d+$/.test(data.employee_id)) {
    errors.employee_id = "Employee ID must contain only numbers.";
  }

  return errors;
}

function CertificateForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [touched, setTouched] = useState({});
  const [validationPassed, setValidationPassed] = useState(false);

  const errors = validateForm(formData);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setValidationPassed(false);
  }

  function handleBlur(event) {
    const { name } = event.target;

    setTouched((previous) => ({
      ...previous,
      [name]: true,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    setTouched({
      address_to: true,
      purpose: true,
      issued_on: true,
      employee_id: true,
    });

    if (Object.keys(errors).length > 0) {
      return;
    }

    // TODO: Integrate with API to submit the form data
    setValidationPassed(true);
  }

  function getError(field) {
    return touched[field] ? errors[field] : undefined;
  }

  return (
    <section>
      <h2>Request Certificate</h2>
      <p>Fill in the details to request your employment certificate.</p>

      <form className="certificate-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="address_to">Address to *</label>
          <textarea
            required
            id="address_to"
            name="address_to"
            rows="3"
            value={formData.address_to}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(getError("address_to"))}
            aria-describedby={getError("address_to") ? "address-error" : undefined}
            placeholder="e.g. Embassy of Neptun"
          />
          {getError("address_to") && (
            <p id="address-error" className="error-message" role="alert">
              {getError("address_to")}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="purpose">Purpose *</label>
          <textarea
            required
            id="purpose"
            name="purpose"
            rows="5"
            value={formData.purpose}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(getError("purpose"))}
            aria-describedby={getError("purpose") ? "purpose-error" : undefined}
            placeholder="Explain why you need this certificate..."
          />
          <span className="character-count">
            {formData.purpose.trim().length} / 50 minimum characters
          </span>
          {getError("purpose") && (
            <p id="purpose-error" className="error-message" role="alert">
              {getError("purpose")}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="issued_on">Issued on *</label>
          <input
            required
            type="date"
            id="issued_on"
            name="issued_on"
            min={getTomorrowDate()}
            value={formData.issued_on}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(getError("issued_on"))}
            aria-describedby={getError("issued_on") ? "date-error" : undefined}
          />
          {getError("issued_on") && (
            <p id="date-error" className="error-message" role="alert">
              {getError("issued_on")}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="employee_id">Employee ID *</label>
          <input
            required
            type="text"
            id="employee_id"
            name="employee_id"
            inputMode="numeric"
            value={formData.employee_id}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(getError("employee_id"))}
            aria-describedby={getError("employee_id") ? "employee-error" : undefined}
            placeholder="e.g. 123456"
          />
          {getError("employee_id") && (
            <p id="employee-error" className="error-message" role="alert">
              {getError("employee_id")}
            </p>
          )}
        </div>

        <button type="submit" className="submit-button">
          Validate Request
        </button>

        {validationPassed && (
          <p className="success-message" role="status">
            All fields are valid. Ready for API integration.
          </p>
        )}
      </form>
    </section>
  );
}

export default CertificateForm;
