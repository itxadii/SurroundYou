import boto3
import os
import json
import uuid

s3_client = boto3.client('s3')

# Amplify automatically provides the bucket name as an environment variable
BUCKET_NAME = os.environ.get('STORAGE_SURROUNDYOUSTORAGE_BUCKETNAME')

def handler(event, context):
    try:
        # API Gateway passes the request data as a JSON string in the 'body'
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        filename = body.get('filename')

        if not action or not filename:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Missing "action" or "filename" in request body'})
            }

        # --- ACTION 1: Generate an UPLOAD URL ---
        if action == 'getUploadUrl':
            # Generate a unique key to prevent filename collisions
            unique_key = f"uploads/{uuid.uuid4()}-{filename}"

            upload_url = s3_client.generate_presigned_url(
                'put_object',
                Params={'Bucket': BUCKET_NAME, 'Key': unique_key},
                ExpiresIn=3600  # URL is valid for 1 hour
            )

            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'uploadUrl': upload_url, 'fileKey': unique_key})
            }

        # --- ACTION 2: Generate a DOWNLOAD URL ---
        elif action == 'getDownloadUrl':
            # The frontend passes the original filename to check for the processed version
            processed_key = f"processed/{os.path.basename(filename)}"

            download_url = s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': BUCKET_NAME, 'Key': processed_key},
                ExpiresIn=3600 # URL is valid for 1 hour
            )

            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'downloadUrl': download_url})
            }

        else:
            return {'statusCode': 400, 'body': json.dumps('Invalid action')}

    except s3_client.exceptions.NoSuchKey:
        # This specific error happens when we ask for a download URL for a file that isn't processed yet.
        return {
            'statusCode': 404,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'File not processed yet or does not exist.'})
        }
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'An internal error occurred'})
        }