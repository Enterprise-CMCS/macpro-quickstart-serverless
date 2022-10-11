import { MutableRefObject } from "react";
import config from "../config";

export function capitalize(s: string) {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function validateAmendmentForm(
  email: string,
  firstName: string,
  lastName: string,
  territory: string
) {
  return (
    email.length > 0 &&
    firstName.length > 0 &&
    lastName.length > 0 &&
    territory.length > 0
  );
}

function validFileSize(file: MutableRefObject<File | null>) {
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

function validFileName(fileName: string) {
  const fileNameRegex = new RegExp("^[0-9a-zA-z-_.]*$");
  if (!fileNameRegex.test(fileName)) {
    alert(
      `The file name contains invalid characters. Only the following characters are allowed: A-Z, a-z, 0-9, -, _, and .`
    );
    return false;
  }
  return true;
}

function validFileExtension(fileName: string) {
  const validExt =
    ".bmp,.csv,.doc,.docx,.gif,.jpg,.jpeg,.odp,.ods,.odt,\n.png,.pdf,.ppt,.pptx,.rtf,.tif,.tiff,.txt,.xls,.xlsx";
  var fileExt = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
  var pos = validExt.indexOf(fileExt);
  if (pos < 0) {
    alert(
      `This file type is not allowed.
  Only files with one of the following extensions are allowed:
  ${validExt}`
    );
    return false;
  }
  return true;
}

export function validateFileAttachment(file: MutableRefObject<File | null>) {
  if (file.current) {
    return (
      validFileSize(file) &&
      validFileName(file.current.name) &&
      validFileExtension(file.current.name)
    );
  }
  return true;
}
