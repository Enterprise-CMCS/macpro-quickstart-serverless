import config from "../config";

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

export function validateFileAttachment(file) {
  if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
    alert(
      `Please pick a file smaller than ${
        config.MAX_ATTACHMENT_SIZE / 1000000
      } MB.`
    );
    return false;
  }
  return true;
}
