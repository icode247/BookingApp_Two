from django.shortcuts import render

def Index(req):
    return render(req, 'index.html')
