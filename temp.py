import requests
import jsonify
import json
from pymongo import MongoClient
import os

# resp = requests.post('http://127.0.0.1:5000/api/login', json = {'id' : 'mehul', 'pwd' : 'xxxx'})
# resp = requests.get('http://127.0.0.1:5000/api/get_skills')
# resp = requests.post('http://127.0.0.1:5000/api/search_projects',json = {'substring':'Project','skills':['Docker']})
# resp = requests.put('http://127.0.0.1:8080/api/register', json = {'id' : 'mehul', 'pwd' : 'xxx', 'email' : 'mehulj475@gmail.com', 'mobile': 6265583431})
# resp = requests.post('http://127.0.0.1:5000/api/project_register', json = {'id' : 'Pranjal', 'pwd' : '123', 'project_name' : 'Project900', 'project_descrp': 'testing', 'skills':['javascript', 'python'], 'github':'https://github.com/PranuPranjal/Demo'})
# resp1 = requests.post('http://127.0.0.1:5000/api/project_register', json = {'id' : 'mehul', 'pwd' : 'xxx', 'project_name' : 'Project2', 'project_descrp': 'test2', 'skills':['python']})
# resp2 = requests.post('http://127.0.0.1:5000/api/project_register', json = {'id' : 'mehul', 'pwd' : 'xxx', 'project_name' : 'Project3', 'project_descrp': 'test3', 'skills':['java', 'cpp']})
# resp = requests.delete('http://127.0.0.1:5000/api/rm_acc', json = {'id' : 'mehul', 'pwd' : 'xxx'})
# resp = requests.post('http://127.0.0.1:5000/api/', json = {'id' : 'mehul', 'pwd' : 'xxx'})

resp = requests.post('http://127.0.0.1:5000/api/project', json = {'project_author' : 'Pranjal'})
# resp = requests.post('http://127.0.0.1:5000/api/add_contributor', json = {'id' : 'mehul', 'pwd' : 'xxx', 'project_id' : 37, 'contributor_id':'Pranu'})
# resp = requests.post('http://127.0.0.1:5000/api/pwd_reset', json = {'id' : 'mehul', 'new_pwd':'xxxx', 'code':8210})
# resp = requests.post('http://127.0.0.1:5000/api/post_message', json = {'sender_id' : 'mehul', 'pwd' : 'xxxx', 'project_id' : 40, 'message':'Hiii'})
# resp = requests.post('http://127.0.0.1:8080/api/get_github', json = {'project_id' : 1})
# resp = requests.post('http://127.0.0.1:5000/api/send_request', json = {'user_id':'Pranu Pranjal', 'project_id' : 45})
# resp = requests.post('http://127.0.0.1:5000/api/accept_request', json = {'user_id':'mehul', 'pwd':'xxxx', 'project_id' : 45, 'name':'Pranu Pranjal'})
# resp = requests.post('http://127.0.0.1:5000/api/change_acc_details', json = {'user_id':'mehul', 'pwd':'xxxx', 'mobile' : 84350767})
# resp = requests.post('http://127.0.0.1:5000/api/add_contributor', json = {'id':'mehul', 'pwd':'xxxx', 'project_id' : 45, 'contributor_name':'mehul12'})
# resp = requests.post('http://127.0.0.1:5000/api/accept_contributor', json = {'id':'mehul12', 'pwd':'xxx', 'project_id' : 45})
# resp = requests.post('http://127.0.0.1:5000/api/llm_chat', json = {'user_id' : 'Pranjal', 
#                                                                    'pwd' : '123', 
#                                                                    'project_id' : 61, 
#                                                                    'prompt':'what does this code do'
#                                                                    })
print(resp.json())