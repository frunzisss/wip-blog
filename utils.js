// converts the file name to route like format
// 1. remove extension of file
// 2. replace any spaces with dashes
// 3 .remove characters that are not alphanumeric or -._
// 4. lowercase it
export const mapTitleToKebabCase = (string) =>
  string
    .replace(/\.[^/.]+$/, "")
    .replace(/ /g, "-")
    .replace(/[^A-Z0-9-._]/gi, "")
    .toLowerCase();
