from django.contrib.auth.decorators import login_required
from django.shortcuts import render, HttpResponseRedirect
from users.forms import LoginForm, RegistrationForm, ProfileForm
from django.contrib import auth, messages
from django.urls import reverse
from baskets.templatetags.baskets_tags import user_baskets
from baskets.models import Baskets
from django.db.models import Prefetch
from orders.models import Order, OrderItem


# Create your views here.
def login(request):
    exception = 'Добро пожаловать'
    if request.method == 'POST':
        form = LoginForm(data=request.POST)
        if form.is_valid():
            username = request.POST["username"]
            password = request.POST["password"]
            user = auth.authenticate(username=username, password=password)
            session_key = request.session.session_key
            if user:
                auth.login(request, user)
                messages.success(request, f"{username}, Вы вошли в аккаунт")

                if session_key:
                        Baskets.objects.filter(session_key=session_key).update(user=user)

                redirect_page = request.POST.get('next', None)
                if redirect_page and redirect_page != reverse('user:logout'):
                    return HttpResponseRedirect(request.POST.get('next'))

                return HttpResponseRedirect(reverse("main:index"))
        else:
            exception = "Неправильный логин или пароль"

                
    else:
        form = LoginForm()
    context = {
        'title': 'Home - Авторизация',
        'form': form,
        'exception': exception,
    }
    return render(request, 'users/login.html', context)


def registration(request):
    if request.method == 'POST':
        form = RegistrationForm(data=request.POST)
        if form.is_valid():
            form.save()
            session_key = request.session.session_key
            user = form.instance
            auth.login(request, user)
            if session_key:
                Baskets.objects.filter(session_key=session_key).update(user=user)
            messages.success(request, f"{user.username}, Вы успешно зарегистрированы и вошли в аккаунт")
            return HttpResponseRedirect(reverse("main:index"))
    else:
        form = RegistrationForm()

    context = {
        'title': 'Home - Регистрация',
        'form_r': form
    }
    return render(request, 'users/login.html', context)


@login_required
def profile(request):
    if request.method == 'POST':
        form = ProfileForm(data=request.POST, instance=request.user, files=request.FILES)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(reverse("user:profile"))
    else:
        form = ProfileForm(instance=request.user)
    
    orders = Order.objects.filter(user=request.user).prefetch_related(
                Prefetch(
                    "orderitem_set",
                    queryset=OrderItem.objects.select_related("dish"),
                )
            ).order_by("-id")


    context = {
        'title': 'Home - Профиль',
        'form': form,
        'orders': orders,
    }
    user_baskets(context, request)
    return render(request, 'users/profile.html', context)


@login_required
def logout(request):
    messages.success(request, f"{request.user.username}, Вы вышли из аккаунта")
    auth.logout(request)
    return HttpResponseRedirect(reverse("main:index"))


def users_basket(request):
    context = {}
    user_baskets(context, request)
    return render(request, 'users/users_basket.html', context)
