import boto3
import os
import json
import uuid

s3_client = boto3.client('s3')

# Amplify automatically provides the bucket name as an environment variable
BUCKET_NAME = os.environ.get('STORAGE_SURROUNDYOUSTORAGE_BUCKETNAME')

# In amplify/backend/function/getPresignedUrl/src/index.py

def handler(event, context):
    try:
        body_str = event.get('body')
        body = json.loads(body_str) if body_str else {}
        action = body.get('action')
        filename = body.get('filename')

        if not BUCKET_NAME:
             raise ValueError("Bucket name environment variable is not set.")
        if not action or not filename:
            return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Missing action or filename'})}

        if action == 'getUploadUrl':
            upload_key = f"uploads/{filename}"
            upload_url = s3_client.generate_presigned_url(
                'put_object',
                Params={'Bucket': BUCKET_NAME, 'Key': upload_key, 'ContentType': 'audio/mpeg'},
                ExpiresIn=3600
            )
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'uploadUrl': upload_url, 'fileKey': upload_key})
            }

        elif action == 'getDownloadUrl':
            original_file_key = filename
            processed_key = f"processed/{os.path.basename(original_file_key)}"
            
            # --- THIS IS THE CRITICAL FIX ---
            # 1. Check if the file actually exists before generating a URL.
            # If it doesn't, this line will raise an error and jump to the 'except' block.
            s3_client.head_object(Bucket=BUCKET_NAME, Key=processed_key)
            
            # 2. Only if the check above succeeds, generate the download URL.
            download_url = s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': BUCKET_NAME, 'Key': processed_key},
                ExpiresIn=3600
            )
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'downloadUrl': download_url})
            }
        else:
            return {'statusCode': 400, 'body': json.dumps({'error': 'Invalid action'})}

    except s3_client.exceptions.ClientError as e:
        # This will now correctly catch the "Not Found" error from head_object.
        if e.response['Error']['Code'] == '404':
            return {
                'statusCode': 404,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'File not processed yet.'})
            }
        # Handle other potential client errors
        print(e)
        return {'statusCode': 500, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'A client error occurred'})}
    except Exception as e:
        print(e)
        return {'statusCode': 500, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'An internal server error occurred'})}