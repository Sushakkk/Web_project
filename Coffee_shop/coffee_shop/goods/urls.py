from django.urls import path

from goods import views

app_name = 'goods'

urlpatterns = [
    path('', views.catalog, name='index'),
    path('dish/<slug:dish_slug>/', views.dish, name='dish'),
]
