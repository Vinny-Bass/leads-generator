# Data Generator and AWS S3 Uploader

This application is designed to generate synthetic data in CSV files, respecting certain percentages and distribution over time. It also includes a script to upload the generated files to AWS S3.

The application includes several files:

- `generator.ts`: Contains the main data generation logic.
- `fields.ts`: Defines the fields that will be included in the CSV files.
- `s3_script.sh`: Shell script to upload the generated CSV files to AWS S3.
- `data`: Directory where the generated CSV files will be stored.

## Setup

1. Clone the repository.
2. Install the dependencies with `npm install`.
3. Create a `.env` file at the root directory with the following variables:
    - `MAX_ROWS_PER_FILE`: The maximum number of rows per CSV file.
    - `AWS_ACCESS_KEY_ID`: Your AWS access key ID.
    - `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key.
    - `AWS_REGION`: The AWS region for the S3 bucket.
4. Update the `verticals` array in `generator.ts` if necessary.

## Usage

Generate CSV files by running the following command:

```
npm run generate
```

This will execute the TypeScript code in `generator.ts`, generating CSV files with synthetic data based on the defined verticals and their percentages. The data for each vertical will be distributed over a number of years, with a growth rate applied. The CSV files will be stored in the `data` directory.

Once the CSV files are generated, you can upload them to an S3 bucket using the following command:

```
./s3_script.sh
```

This will execute the shell script in `s3_script.sh`, which uploads any CSV files in the `data` directory to AWS S3, then deletes the local files. The files will be uploaded to the root of the S3 bucket specified in `.env`.