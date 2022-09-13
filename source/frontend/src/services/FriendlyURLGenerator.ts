function generateFromDashboardName(dashboardName: string): string {
  return dashboardName
    .trim()
    .toLocaleLowerCase()
    .replace(/[!#$&'\(\)\*\+,\/:;=\?@\[\]]+/g, " ") // remove RFC-3986 reserved characters
    .replace(/\s+/g, "-") // replace spaces for dashes
    .replace(/-+/g, "-") // convert consecutive dashes to singular dash
    .replace(/^-+|-+$/g, ""); // remove dashes at the end and beginning
}

const FriendlyURLGenerator = {
  generateFromDashboardName,
};

export default FriendlyURLGenerator;
