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
  if (file.current) {
    if (file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return false;
    }
    const validExt =
      ".bmp,.csv,.doc,.docx,.gif,.jpg,.jpeg,.odp,.ods,.odt,.png,.pdf,.ppt,.pptx,.rtf,.tif,.tiff,.txt,.xls,.xlsx";
    var fileName = file.current.name;
    var fileExt = fileName
      .substring(fileName.lastIndexOf(".") + 1)
      .toLowerCase();
    var pos = validExt.indexOf(fileExt);
    if (pos < 0) {
      alert(
        `This file type is not allowed.  Only files with one of the following extensions are allowed:  ${validExt}`
      );
      return false;
    }
  }
  return true;
}
