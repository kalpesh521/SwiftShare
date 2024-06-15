import os
import shutil
from io import BytesIO

from django.conf import settings


def list_files_in_folder(folder_path):
    """
        function to list all files in folder
        @param: folder_path
    """
    if not os.path.isdir(folder_path):
        return []
    file_names = []
    for file_name in os.listdir(folder_path):
        if os.path.isfile(os.path.join(folder_path, file_name)):
            file_names.append(file_name)
    return file_names


def zip_files(folder_id):
    # return the zip path of given folder_id
    return shutil.make_archive(f'public/zip_files/{folder_id}', 'zip', f'public/static/{folder_id}')


def remove_local_folder(folder_id, extra_path="static"):
    # remove the locally created folder from memory
    path = str(settings.BASE_DIR) + f'/public/{extra_path}/{folder_id}'
    if extra_path == "zip_files":
        path += ".zip"
    try:
        if os.path.isfile(path) or os.path.islink(path):
            os.remove(path)  # remove the file
        elif os.path.isdir(path):
            shutil.rmtree(path)  # remove dir and all contains
    except (FileNotFoundError, OSError) as ex:
        print(ex)
        pass


def download_zip(url, folder_id, signed_id):
    import requests
    from django.http import FileResponse
    response = requests.get(url)
    if response.status_code == 200:
        file_content = BytesIO(response.content)
        content_type = response.headers['Content-Type']
        filename = f"{folder_id}_{signed_id}.zip"
        file_response = FileResponse(file_content, content_type=content_type)
        file_response["Content-Disposition"] = f"attachment; filename={filename}"
        return file_response

