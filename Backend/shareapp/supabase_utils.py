import mimetypes

from django.conf import settings
from supabase import Client, create_client

## read secrests from .env
# supabase_url = 'https://pfjjfcvapkwqugplburm.supabase.co'
# supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmampmY3ZhcGt3cXVncGxidXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU1MDU4NTAsImV4cCI6MjAzMTA4MTg1MH0.9BoKWhD79j4SRbq_XlDF5UcfIuAcojiqULVL8AOicBU"
# supabase_bucket = "test"
# password = "irfhfNu95*%CiL8"
# service_role_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmampmY3ZhcGt3cXVncGxidXJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNTUwNTg1MCwiZXhwIjoyMDMxMDgxODUwfQ.Jn0Cd7eAUob0m0TzdjBg6uNbC9IQh2g-gxBqYqXV-5g"

supabase_url = 'https://kxwwfoqqrgwadforwdvd.supabase.co'
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4d3dmb3Fxcmd3YWRmb3J3ZHZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU1MDMxMjIsImV4cCI6MjAzMTA3OTEyMn0.OeB2o5qcLoGoYyoXn8AEE2K3Euy54mvKMMH_fDyPUQQ"
supabase_bucket = "testbucket"
supabase: Client = create_client(supabase_url, supabase_key)


def upload_file(file_name, folder_id, _zip=False):
    """
        Function to upload files to supabase
        @param file_name: name of the file to upload or path of the file
        @param folder_id: unique if of folder
        @param _zip: if true upload the zip folder to supabase

    """
    if _zip:
        filepath = file_name
        file_name = folder_id
    else:
        filepath = str(settings.BASE_DIR) + f"/public/static/{folder_id}/{file_name}"
    try:
        content_type = mimetypes.guess_type(filepath)
    except Exception as ex:
        content_type = ('application/zip', None)
    filepath = filepath.replace('\\', '/')
    with open(filepath, 'rb') as f:
        response = supabase.storage.from_(supabase_bucket).upload(file=f,
                                                                  path=f'{folder_id}/{file_name}',
                                                                  file_options={"content-type": content_type[0]})
        print(response.json())
    return response.status_code == 200


def download_file(folder_id):
    import os
    files = get_all_files(folder_id)
    destination = str(settings.BASE_DIR) + f"/public/downloads/{folder_id}"
    if not os.path.exists(destination):
        os.mkdir(destination)
    for file in files:
        filename = file['name']
        with open(destination + f"/{filename}", 'wb+') as f:
            res = supabase.storage.from_(supabase_bucket).download(f"{supabase_bucket}/{folder_id}/{filename}")
            f.write(res)


def create_signed_url(filepath, expiry_duration, bucket_name=supabase_bucket):
    filepath = filepath.split(".")[0] # remove .zip
    return supabase.storage.from_(bucket_name).create_signed_url(filepath, expiry_duration)


def get_all_files(folder_id, bucket_name=supabase_bucket):
    return supabase.storage.from_(supabase_bucket).list(f"{bucket_name}/{folder_id}")


def get_public_url(folder_id, bucket_name=supabase_bucket):
    return supabase.storage.from_(bucket_name).get_public_url(f'test/d4dbff1529d74ae2809b41251867f54d/Resume.pdf')


def get_buckets(name=None):
    return supabase.storage.get_bucket(name) if name else supabase.storage.list_buckets()
