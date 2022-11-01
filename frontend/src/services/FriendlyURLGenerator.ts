function generateFromDashboardName(dashboardName: string): string {
  return dashboardName
    .toLocaleLowerCase()
    .replace(/[!#$&'()*+,/:;=?@[\]-]+/g, " ") // replace RFC-3986 reserved characters and dashes with white spaces.
    .trim() // remove spaces from the beginning and the end.
    .replace(/\s+/g, "-") // replace spaces for dashes
    .replace(/-+/g, "-"); // convert consecutive dashes to singular dash
}

const FriendlyURLGenerator = {
  generateFromDashboardName,
};

export default FriendlyURLGenerator;
