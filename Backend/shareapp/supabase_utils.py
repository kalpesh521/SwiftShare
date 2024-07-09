import mimetypes
import os
from dotenv import load_dotenv
from django.conf import settings
from supabase import Client, create_client

load_dotenv()

 
supabase_url = os.getenv('supabase_url')
supabase_key =  os.getenv('supabase_key')
supabase_bucket =  os.getenv('supabase_bucket')

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
    filepath = filepath.split(".")[0] 
    return supabase.storage.from_(bucket_name).create_signed_url(filepath, expiry_duration)


def get_all_files(folder_id, bucket_name=supabase_bucket):
    return supabase.storage.from_(supabase_bucket).list(f"{bucket_name}/{folder_id}")


def get_public_url(folder_id, bucket_name=supabase_bucket):
    return supabase.storage.from_(bucket_name).get_public_url(f'test/d4dbff1529d74ae2809b41251867f54d/Resume.pdf')


def get_buckets(name=None):
    return supabase.storage.get_bucket(name) if name else supabase.storage.list_buckets()
