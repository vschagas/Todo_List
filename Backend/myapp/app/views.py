from django.http import HttpResponse


def app(request):
    response = HttpResponse("Hello world>>>>>>>")

    return response
