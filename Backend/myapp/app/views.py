from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Task
import json


@csrf_exempt
def create_task(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            task_name = data.get('task')
            status = data.get('status')

            task = Task.objects.create(task=task_name, status=status)

            return JsonResponse({'message': 'Task criada com sucesso!'})

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Formato JSON inválido'}, status=400)

    else:
        return JsonResponse({'error': 'Método não permitido'}, status=405)


# def read_tasks(request):
#     if request.method == 'GET':
#         tasks = Task.objects.all()

#         task_list = [{
#             "id": task.id,
#             "task": task.task,
#             "status": task.status}
#             for task in tasks]

#         return JsonResponse({'tasks': task_list})

#     else:
#         return JsonResponse({'error': 'Método não permitido'}, status=405)
