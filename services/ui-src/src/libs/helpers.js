export function capitalize(s) {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function validateAmendmentForm(email, firstName, lastName, territory) {
  return (
    email.length > 0 &&
    firstName.length > 0 &&
    lastName.length > 0 &&
    territory.length > 0
  );
}
