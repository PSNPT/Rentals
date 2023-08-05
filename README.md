# Description
An example website for short term rentals built using Django and React. Some parody data has been pre-loaded as a demonstration of its usage. The website can be hosted on the web, but currently is intended to be hosted locally as a means of demonstration rather than deployment.

# Requirements
- [Ubuntu](https://ubuntu.com/)

# Execution
1. Change permissions of each of the three shell scripts to allow execution.  
(Eg: In a terminal at project root, type `chmod 777 backend.sh`)
2. To install the neccesarily pre-requisites and initialize a virtual environment, run `startup.sh`
3. In a terminal at project root, type `source ./venv/bin/activate` to enter the virtual environment
4. Run `backend.sh` to initialize the Django backend
5. In another terminal at project root, type `source ./venv/bin/activate` to enter the virtual environment and run `frontend.sh` to intialize the React frontend
6. Thats it! In a web browser of your choice, go to http://localhost:3000/home and begin exploring the website
