from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Task
import json
from django.db import transaction


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
