## Serverless Framework plugin to cleanup old ECR images.

### Functionalities

The serverless-ecr-image-cleaner package is responsible for deleting old ECR images after deployment of cloudformation stack. It uses the AWS SDK to interact with the ECR service and retrieve information about the images in the repository. It then sorts the images by the date they were pushed and deletes the oldest ones, keeping only the most recent one.

### Installation
```
npm i serverless-ecr-image-cleaner
```

### Usage
In the `serverless.yml` file add `serverless-ecr-image-cleaner` to your plugin configuration and if you have any custom values for appRegion, repositoryName and  numImagesToKeep add in the `custom` values.
```
service: ecr-images
frameworkVersion: "3"

provider:
  name: aws
  runtime: nodejs18.x

plugins:
  - serverless-ecr-image-cleaner

custom:
  appRegion: us-east-1
  repositoryName: ExampleRepositoryName
  numImagesToKeep: 2
```
#### Custom Variables
 - `appRegion` (string) (optional) - Region of the ECR repository `(default: 'us-east-1')`.
 - `repositoryName` (string) (optional) -  Repository name to delete the ECR images from the repository `(default: 'serverless-{serviceName}-{this.options.stage}')`.
 - `numImagesToKeep` (integer) (optional) - Count of the images to keep the latest number of images in the repository `(default: 6)`.