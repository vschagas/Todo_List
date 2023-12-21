from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Task
import json
from django.db import transaction
from minio import Minio
import os
import dotenv
from django.core.files.storage import FileSystemStorage
import os
from PIL import Image
from datetime import datetime



dotenv.load_dotenv()

MINIO_ENDPOINT = os.getenv('MINIO_ENDPOINT', 'http://172.22.0.2:9001/')
MINIO_ACCESS_KEY = os.getenv('MINIO_ACCESS_KEY', 'user')
MINIO_SECRET_KEY = os.getenv('MINIO_SECRET_KEY', 'password')
MINIO_BUCKET_NAME = os.getenv('MINIO_BUCKET_NAME', 'static')


def save_image_to_folder(image):
    fs = FileSystemStorage(location="images")
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S%f")
    filename = fs.save(f'{timestamp}_{image.name}', image)
    file_path = fs.url(filename)

    return file_path


@csrf_exempt
def create_task(request, *args, **kwargs):
    if request.method == 'POST':
        print(MINIO_ENDPOINT)
        print(MINIO_ACCESS_KEY)
        print(MINIO_SECRET_KEY)
        print(MINIO_BUCKET_NAME)
        try:
            # save_image = save_image_to_folder(image)
            data = json.loads(request.body.decode('utf-8'))
            task_name = data.get('task')
            status = data.get('status')

            image = request.FILES.get('image')

            task = Task.objects.create(task=task_name, status=status)
            # url_add = fs.url(filename)
            # task.image_url = url_add
            task.save()

            return JsonResponse({'message': 'Task criada com sucesso!'})

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Formato JSON inválido'}, status=400)

    else:
        return JsonResponse({'error': 'Método não permitido'}, status=405)
# def create_task(request):

#     # if request.method == 'POST' and request.FILES['image']:
#     #     myfile = request.FILES['image']
#     #     fs = FileSystemStorage()
#     #     filename = fs.save(myfile.name, myfile)
#     #     uploaded_file_url = fs.url(filename)
#     #     return JsonResponse({'uploaded_file_url': uploaded_file_url})

#     # return 10
#     if request.method == 'POST':
#         print(MINIO_ENDPOINT)
#         print(MINIO_ACCESS_KEY)
#         print(MINIO_SECRET_KEY)
#         print(MINIO_BUCKET_NAME)
#         try:
#             data = json.loads(request.body.decode('utf-8'))

#             task_name = data.get('task')
#             status = data.get('status')
#             image = request.FILES.get('image')

#             print(f'Request JSON: {json.dumps(data)}')

#             task = Task.objects.create(task=task_name, status=status)

#             minio_client = Minio(
#                 MINIO_ENDPOINT,
#                 access_key=MINIO_ACCESS_KEY,
#                 secret_key=MINIO_SECRET_KEY,
#                 secure=False
#             )
#             object_name = f'task_images/{task.id}_{image.name}'

#             minio_client.put_object(
#                 MINIO_BUCKET_NAME,
#                 object_name,
#                 image,
#                 length=image.size,
#                 content_type=image.content_type
#             )
#             url_add = f'https://{MINIO_ENDPOINT}/{MINIO_BUCKET_NAME}/{object_name}'
#             task.image_url = url_add
#             task.save()

#             return JsonResponse({'message': 'Task criada com sucesso!'})

#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Formato JSON inválido'}, status=400)

#     else:
#         return JsonResponse({'error': 'Método não permitido'}, status=405)


def read_tasks(request):
    if request.method == 'GET':
        tasks = Task.objects.all()

        task_list = [{
            "id": task.id,
            "task": task.task,
            "status": task.status}
            for task in tasks]

        return JsonResponse({'tasks': task_list})

    else:
        return JsonResponse({'error': 'Método não permitido'}, status=405)


def read_task_by_id(request):
    task_id = request.GET.get('id', '')

    if task_id:
        try:
            task = Task.objects.get(id=task_id)
            task_data = {
                "id": task.id,
                "task": task.task,
                "status": task.status
            }
            return JsonResponse({'task': task_data})
        except Task.DoesNotExist:
            return JsonResponse({'error': 'Tarefa não encontrada'}, status=404)
    else:
        return JsonResponse({'error': 'ID da tarefa não fornecido'}, status=400)


@csrf_exempt
def update_task(request):
    if request.method == 'PUT':
        try:
            task_id = request.GET.get('id')

            if not task_id:
                return JsonResponse(
                    {'error': 'ID da task não fornecido'},
                    status=400)

            try:
                task = Task.objects.get(id=task_id)
            except Task.DoesNotExist:
                return JsonResponse(
                    {'error': 'Task não encontrada'},
                    status=404)

            data = json.loads(request.body)
            task.task = data.get('task', task.task)
            task.status = data.get('status', task.status)
            task.save()

            return JsonResponse({'message': 'Task editada com sucesso!'})

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Formato JSON inválido'}, status=400)

    else:
        return JsonResponse({'error': 'Método não permitido'}, status=405)


@csrf_exempt
@transaction.atomic
def delete_tasks(request):
    if request.method == 'DELETE':
        task_ids = request.GET.getlist('id')

        if not task_ids:
            return JsonResponse(
                {'error': 'Parâmetro "id" não fornecido'},
                status=400)

        try:
            with transaction.atomic():
                tasks_deleted = Task.objects.filter(id__in=task_ids).delete()

                if tasks_deleted[0] > 0:
                    return JsonResponse(
                        {'message': f'{tasks_deleted[0]} tasks excluídas com sucesso!'})
                else:
                    return JsonResponse(
                        {'error': 'Tarefa não encontrada com os IDs fornecidos'},
                        status=404)

        except Exception as e:
            return JsonResponse({'error': f'Erro ao excluir tarefas: {str(e)}'}, status=500)

    else:
        return JsonResponse({'error': 'Método não permitido'}, status=405)
