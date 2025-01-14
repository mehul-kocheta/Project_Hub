import requests
import jsonify
import json
from pymongo import MongoClient

# resp = requests.get('http://127.0.0.1:5000/api/login', json = {'id' : 'mehul', 'pwd' : 'xxxx'})
# resp = requests.get('http://127.0.0.1:5000/api/get_skills')
# resp = requests.get('http://127.0.0.1:5000/api/search_projects',json = {'substring':'Pro', 'skills':['python', 'cpp']} )
# resp = requests.put('http://127.0.0.1:5000/api/register', json = {'id' : 'mehul', 'pwd' : 'xxx', 'email' : 'mehulj475@gmail.com', 'mobile': 234})
# resp = requests.post('http://127.0.0.1:5000/api/project_register', json = {'id' : 'mehul', 'pwd' : 'xxxx', 'project_name' : 'Project700', 'project_descrp': '*********', 'skills':['javascript', 'csharp']})
# resp1 = requests.post('http://127.0.0.1:5000/api/project_register', json = {'id' : 'mehul', 'pwd' : 'xxx', 'project_name' : 'Project2', 'project_descrp': 'test2', 'skills':['python']})
# resp2 = requests.post('http://127.0.0.1:5000/api/project_register', json = {'id' : 'mehul', 'pwd' : 'xxx', 'project_name' : 'Project3', 'project_descrp': 'test3', 'skills':['java', 'cpp']})
# resp = requests.delete('http://127.0.0.1:5000/api/rm_acc', json = {'id' : 'mehul', 'pwd' : 'xxx'})
# resp = requests.post('http://127.0.0.1:5000/api/', json = {'id' : 'mehul', 'pwd' : 'xxx'})

# resp = requests.get('http://127.0.0.1:5000/api/project', json = {'project_author' : 'mehul'})
# resp = requests.post('http://127.0.0.1:5000/api/add_contributor', json = {'id' : 'mehul', 'pwd' : 'xxx', 'project_id' : 37, 'contributor_id':'Pranu'})
# resp = requests.post('http://127.0.0.1:5000/api/pwd_reset', json = {'id' : 'mehul', 'new_pwd':'xxxx', 'code':8210})
# resp = requests.post('http://127.0.0.1:5000/api/post_message', json = {'sender_id' : 'mehul', 'pwd' : 'xxxx', 'project_id' : 40, 'message':'Hiii'})
resp = requests.post('http://127.0.0.1:5000/api/get_features', json = {'project_id' : 39})
print(resp.json())