# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.9.2]

### Changed

- Migrate to AWS SDK v3.
- Upgrade to Node.js 18.

## [1.9.1] - 2023-12-15

### Fixed

- bump axios and crypto-js packages.
- cloud formation template schema issue.

## [1.9.0] - 2023-07-14

### Added

- Migration from AWS CDK v1 to AWS CDK v2.
- Ability to ask credentials to users on public part of the app.
- Improvements to meet WCAG accessibility requirements.

### Fixed

- Dependency libraries to address potential security vulnerabilities.

## [1.8.1] - 2023-05-01

- Update our CDK code in PDoA v1.8 to turn on S3 ACLs.  They are [no longer on by default](https://aws.amazon.com/it/about-aws/whats-new/2022/12/amazon-s3-automatically-enable-block-public-access-disable-access-control-lists-buckets-april-2023/) as of April 2023

## [1.8.0] - 2022-11-21

- Settings page enhancement
- Accessibility enhancements across the app
- Fixing SonarQube alarms
- Move to Solutions GitHub release pipeline

## [1.7.0] - 2022-09-13

- Security vulnerabilities were addressed by upgrading the following libraries:
  - node v14.x
  - react-scripts 5.0.1
- Dashboard creation simplifications
- Support for Google Analytics tracking was added.

## [1.6.0] - 2022-08-22

- Optimize resource usage for lambda functions
- Enable private dashboard instances
- Added support for metrics/analytics collection
- Made improvements to meet WCAG accessibility requirements
  - DatePicker
  - Drag'n'Drop

## [1.5.0] - 2022-06-08

- Made improvements to meet WCAG accessibility requirements
  - Pagination
  - Fix contrast colors in multiple components
  - Associate hints with inputs
  - Improve accessibility of text areas and table buttons
  - Improve the search functionality's user experience and accessibility
  - Add aria-role alert for Alert component
  - Makes interactive legends accessible and programmatically available
  - Add programmatic status messages to tables
  - Make modal experience more accessible
- Add a hover state to tabs and make topic areas hidden by default
- Improve the layout of the add/edit metric screen
- Add support for the new table pagination layout
- Fix numbering logic
- Fix the Save functionality in Edit Table/Chart
- Perform html escape on the returned error message
- Improves the UX for the CheckData component
- Updated dependency libraries to address potential security vulnerabilities

## [1.3.0] - 2022-03-07

- Made improvements to meet WCAG accessibility requirements
  - Added programmatic structure to sections in dashboard editor
  - Removed ARIA 'Current' attributes for dashboard to avoid misleading screen readers
  - Updated modal experience to be more accessible
  - Updated Settings pages to use proper heading mark-ups
  - Improved the user experience of working with Check Data step columns
  - Added programmatic status messages when actions are taken
- Updated dependency libraries to address potential security vulnerabilities

## [1.2.0] - 2022-02-02

- Made improvements to meet WCAG accessibility requirements
  - Provided appropriate text alternative for icons
  - Made errors clearly identifiable and described to assistive technology
  - Removed hidden buttons from assistive technology
  - Improved the application of non-decorative content in CSS to support assistive technology
  - Added section aria label to live previews
- Provided additional control over image formatting

## [1.1.7] - 2022-01-04

- Made improvements to meet WCAG accessibility requirements
  - Made "Return to Top" link actionable for screen readers
  - Made table of contents scrollable and visible
  - Made Settings acknowledge statement mandatory
  - Made scrollable regions focusable for accessibility
  - Improved focus order of table of contents
  - Added programmatic context to grouped form elements to benefit screen readers

## [1.1.6] - 2021-12-17

- Copy/duplicate an individual dashboard
- Made improvements to meet WCAG accessibility requirements
  - Added text alternative to label images
  - Establish unique page titles
  - Made global button color changes
  - Introduced different visual indicators beyond color for line charts
  - Improved vertical tabs for accessibility

## [1.1.5] - 2021-11-29

- Made improvements to meet WCAG accessibility requirements
  - Improve text color contrast ratio
  - Improve contrast for non-text elements
  - Ensure all optional and mandatory fields are marked
  - Move status alerts to top of page
  - Improve accessibility of column sorting in tables

## [1.1.4] - 2021-11-15

- An example dashboard in English, Spanish, or Portuguese is included on solution installation.
- Search on Homepage now extends to other text portions of the dashboard, beyond the name.
- The pagination feature for a table component now has its display vary based on size for improved customer experience.

## [1.1.3] - 2021-10-28

### Added

- On public dashboard page, scrolling up now highlights a Section's table of contents entry
- Improved accessiblity by adding labels to the Check Data column checkboxes and alt-text for the logo upload in Settings
- Uploaded favicon retains original filename

## [1.1.2] - 2021-10-14

### Added

- Set data format of multiple columns when working with data table of Chart and Table content items
- Editors have option to not show all rows of extensive tables

## [1.1.1] - 2021-10-05

### Added

- Enable customization of table of contents
- Improve preview dashboard experience on mobile screens

## [1.1.0] - 2021-09-30

### Added

- Option to display sections in tab
- Improve mobile experience for editors
- Support for stacked bar and column charts
- Editor access to view previous dashboard versions

## [1.0.6] - 2021-09-03

### Added

- Allow dashboard content items to be grouped in sections
- Allow for drag and drop of content items when using with sections
- Pagination in the "check data" step when loading a dataset for a chart or table

## [1.0.5] - 2021-09-01

### Added

- New table of contents on public page to help navigate longer dashboards
- Various UI enhancements to improve displaying on mobile screens

## [1.0.4] - 2021-07-21

### Added

- Show only relevant sorting options for part-to-whole and donut/pie charts
- Improve page load performance

## [1.0.3] - 2021-07-07

### Added

- Support donut and pie charts for chart types in dashboard
- Allow for metrics to be formatted as currency or percentage

## [1.0.2] - 2021-06-09

### Added

- Allow exporting of the underlying dataset for a chart and table in a published dashboard
- Expanded vertical display for bar charts

## [1.0.1] - 2021-05-26

### Added

- Reorder dashboard content items via drag and drop
- Copy a content item in a dashboard to a new content item

## [1.0.0] - 2021-04-28

### Added

- All files, initial version
