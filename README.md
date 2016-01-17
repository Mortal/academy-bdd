Academy
=======

This is a variant of the famous card game Academy created in Django, the Python
web framework. The project uses Django 1.9 and Python 3.3 (or newer).

To run the game locally, you must install PostgreSQL and Python 3 which ships
with the `pyvenv` since Python 3.3.

Create a virtual environment and install Django and the packages specified in
requirements.txt:

```
pyvenv venv
source venv/bin/activate
pip install -r requirements.txt
```

Now, while inside the virtual environment (activated by the command
`source venv/bin/activate`), enter the root of the academy project
and setup the database and run the server.
If you are prompted by Django to create a superuser,
this is not necessary at the current moment.

```
./manage.py migrate
./manage.py runserver
```
