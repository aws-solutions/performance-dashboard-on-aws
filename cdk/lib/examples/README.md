Export a dashboard
1. get dashboard id from url
    /admin/dashboard/<dashboard id>/
2. Find the dashboard board in dynammo db
   PK and SK will equal "Dashboard#<dashboard id>".
3. Export the dashboard as json
    ** View as Json. Set View as DynamoDB JSON to off. Copy the JSON and save to text file. dashboard.json
4. copy TopicareaId in dashboard.json and export the topicarea  to topicarea.json
5. Find all of the widgets for the dashboard and export the json. PK will equal "Dashboard#<dashboard id>" and SK will start with Widget#.
6. For each widget that is a chart export the dataset. In the widget json there is a field datasetId. You can find the data set with PK AND SK will equal "Dataset#<dataset id>"
7. Download the data sets from s3. Go to the -datasets s3 bucket /public folder.
8. Find the datasets using the s3 keys found in the dataset.json and download the json and csv.
