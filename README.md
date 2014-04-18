Academy
=======

This is a variant of the famous card game Academy created in Django, the Python
web framework. The project uses Django 1.7 and Python 3.3 (or newer).

To run the game locally, you must install PostgreSQL and Python 3 which ships
with the `pyvenv` since Python 3.3.

Create a virtual environment and install Django and the packages specified in
requirements.txt:

```
pyvenv venv
cd venv
source bin/activate
pip install https://github.com/django/django/archive/1.7b1.tar.gz
pip install -r /path/to/academy-bdd/requirements.txt
```

Now, while inside the virtual environment (activated by the command
`source bin/activate`), enter the root of the academy project
and setup the database and run the server.
If you are prompted by Django to create a superuser,
this is not necessary at the current moment.

```
cd /path/to/academy-bdd
./manage.py migrate
./manage.py runserver
```
