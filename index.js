const AWS = require('aws-sdk');

/* 
The EcrImageCleaner class is responsible for deleting old ECR images after deployment.
It uses the AWS SDK to interact with the ECR service and retrieve information about the images in the repository.
It then sorts the images by the date they were pushed and deletes the oldest ones, keeping only the most recent ones.
*/
class EcrImageCleaner {
    constructor(serverless, options) {
        this.serverless = serverless;
        this.options = options;

        this.hooks = {
            'after:deploy:deploy': this.cleanImages.bind(this),
        };
    }

    async cleanImages() {
        const serviceValues = this.serverless.service;

        const serviceName = serviceValues.service;
        const customValues = serviceValues.custom;

        const appRegion = customValues?.appRegion ? customValues.appRegion : serviceValues.provider.region; // if user not provided the appRegion value then default will be used from the setting of serverless configs.
        const repositoryName = customValues?.repositoryName ? customValues.repositoryName : `serverless-${serviceName}-${this.options.stage}`; // if user not provided the repositoryName value then default will be used from the setting of serverless configs.
        const numImagesToKeep = customValues?.numImagesToKeep ? customValues.numImagesToKeep : 6; // if user not provided the numImagesToKeep value then default will be 6

        const ecr = new AWS.ECR({ region: appRegion });

        console.log('appRegion: ', appRegion);
        console.log('repositoryName: ', repositoryName);
        console.log('numImagesToKeep: ', numImagesToKeep);


        try {
            // describeImages function gives the all information of the all images, and we mostly need imagePushedAt
            const { imageDetails } = await ecr.describeImages({ repositoryName }).promise();

            // Sort the images by their creation time, so will get the most recent at the start of the an array
            const sortedImages = imageDetails.sort((a, b) => new Date(b.imagePushedAt) - new Date(a.imagePushedAt));

            // It will remove the first 6 images(numberImagesToKeep) and return an array of other images.
            const imagesToDelete = sortedImages.slice(numImagesToKeep);

            // It wil update all the images to add the imageDigest.
            const imageIdsToDelete = imagesToDelete.map(image => ({ imageDigest: image.imageDigest }));

            // if the length of imageIdsToDelete more then 0 it will remove all the images from repository else log message
            if (imageIdsToDelete.length) {
                await ecr.batchDeleteImage({ repositoryName, imageIds: imageIdsToDelete }).promise();
                this.serverless.cli.log('Old ECR images deleted successfully.');
            } else {
                this.serverless.cli.log(`Images are not more then ${numImagesToKeep}, So no need to delete them.`);
            }
        } catch (error) {
            this.serverless.cli.log('Failed to delete old ECR images.');
            console.error(error);
        }
    }
}

module.exports = EcrImageCleaner;