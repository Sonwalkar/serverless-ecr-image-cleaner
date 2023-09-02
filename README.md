## Serverless Framework plugin to cleanup old ECR images.

### Functionalities

The EcrImageCleaner class is responsible for deleting old ECR images after deployment. It uses the AWS SDK to interact with the ECR service and retrieve information about the images in the repository. It then sorts the images by the date they were pushed and deletes the oldest ones, keeping only the most recent ones.

### Important variables
 - `appRegion` (string) (optional) - Region of the ECR repository
 - `repositoryName` (string) (optional) -  Repository name to delete the ECR images from the repository
 - `numImagesToKeep` (integer) (optional) - Count of the images to keep the latest number of images in the repository