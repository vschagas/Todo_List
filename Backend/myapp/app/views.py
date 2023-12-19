# from django.http import HttpResponse


# def app(request):
#     response = HttpResponse("Hello world>>>>>>>")

#     return response


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
