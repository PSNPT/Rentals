cd backend
pip3 install -r packages.txt
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py loaddata finaldata.json
python3 manage.py runserver

