from flask import Flask, request, jsonify, session, url_for, redirect, g
from flask_restful import Api, Resource, reqparse, abort, fields, marshal_with
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, Table, Column, Integer, String, MetaData, inspect, text
import requests
from github_intigration import get_repo_data
from flask_mail import Mail, Message
import random
import os
import datetime
from flask_cors import CORS
from pymongo import MongoClient
import json
from groq_test import download_github_repo, read_py_files, ask_groq_api

app = Flask(__name__)
api = Api(app)
app.secret_key = 'mehul'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:root@127.0.0.1:3306/projecthub'
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'testflaskapplication@gmail.com'
app.config['MAIL_PASSWORD'] =  str(os.environ['pass_key'])
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
mongo_client = MongoClient("mongodb://localhost:27017/")
mongo_db = mongo_client["project_hub"]
mongo_project_data = mongo_db["project_data"]
mongo_account_data = mongo_db["account"]
db = SQLAlchemy(app)
engine = create_engine('mysql+mysqlconnector://root:root@127.0.0.1:3306/projecthub')
Session = sessionmaker(bind=engine) 
session = Session()

dynamic_classes = {}
Base = declarative_base()

mail = Mail(app)
CORS(app)

class AccountModel(db.Model):
    __tablename__ = 'Account'
    
    user_id = db.Column(db.String(50), primary_key = True)
    user_pwd = db.Column(db.String(50), nullable = False)
    user_email = db.Column(db.String(50), nullable = False)
    user_mobile =db.Column(db.Integer, nullable = False)
    pwd_change_code = db.Column(db.Integer, nullable = True)

    def __repr__(self):
        return f"Account(id = {id})"
    
class ProjectModel(db.Model):
    __tablename__ = 'Project_data'
    
    project_id = db.Column(db.Integer, primary_key = True, autoincrement=True)
    project_name = db.Column(db.String(100), nullable = False)
    project_descrp = db.Column(db.String(400), nullable = True)
    project_author = db.Column(db.String(100), nullable = False)
    
    def __repr__(self):
        return f"Project(id = {id})"
    

def create_table_class(skill):
    class_name = f"DynamicTable_{skill}"
    
    if class_name in dynamic_classes:
        return dynamic_classes[class_name]
    
    class DynamicTable(Base):
        __tablename__ = skill
        project_name = Column(Integer, primary_key=True)
        
    dynamic_classes[class_name] = DynamicTable
    
    return DynamicTable

    
with app.app_context():
    db.create_all()
    
@app.before_request
def before_request():
    g.db_session = Session()

@app.teardown_request
def teardown_request(exception=None):
    if hasattr(g, 'db_session'):
        g.db_session.close()

class LoginResource(Resource):
    def post(self):
        id = request.json.get('id')
        pwd = request.json.get('pwd')
        print(id)
        results = AccountModel.query.filter_by(user_id = id).first()
        if not results:
            return jsonify({"message" : "User does not exists", 'status' : 404})
        
        if pwd == results.user_pwd:
            return jsonify({'message' : "Successfully logged in", 'status' : 200})
        else:
            return jsonify({'message' : "Unsuccessful", 'status' : 209})
        
class RegisterResource(Resource):
    def put(self):
        id = request.json.get('id')
        pwd = request.json.get('pwd')
        email = request.json.get('email')
        number = request.json.get('mobile')
        Linkedin = request.json.get('Linkedin')
        github = request.json.get('github')
        college = request.json.get('college_name')
        degree = request.json.get('degree')
        skills = request.json.get('skills')
        about = request.json.get('about')
        
        if not skills:
            skills = []
        
        results = AccountModel.query.filter_by(user_id = id).first()
        if results:
            return jsonify({"message" : "User already exists", 'status' : 409})
        
        acc = AccountModel(user_id = id, user_pwd = pwd, user_email = email, user_mobile = number)
        db.session.add(acc)
        db.session.commit()
        
        data = {
            'user_id':id, 
            'Linkedin':Linkedin, 
            'github':github, 
            'Email' : email, 
            'Friend':[], 
            'Projects':[], 
            'Requests':[], 
            'Skills':skills, 
            'College_name':college,
            'Degree':degree,
            'Pending':[],
            'about':about
            }
        try:
            mongo_account_data.insert_one(data)
            return jsonify({"message": "User data added successfully", "status": 200})
        except Exception as e:
            return jsonify({"message": str(e), "status": 500})
    
class PasswordChangeResource(Resource):
    def post(self):
        id = request.json.get('id')
        new_pwd = request.json.get('new_pwd')
        code = request.json.get('code')
        results = AccountModel.query.filter_by(user_id = id).first()
        if not results:
            return jsonify({"message" : "User does not exists", 'status' : 404})
        else:
            if int(code) == int(results.pwd_change_code):
                results.user_pwd = new_pwd
                db.session.commit()
                db.session.close()
                return jsonify({"message" : "Successful", 'status' : 200})
            else:
                db.session.commit()
                db.session.close()
                return jsonify({"message" : "Code not right", 'status' : 409})
            
class ProjectRegisterResource(Resource):
    def post(self):
        name = request.json.get('project_name')
        descrp = request.json.get('project_descrp')
        id = request.json.get('id')
        pwd = request.json.get('pwd')
        git = request.json.get('github')
        deadline = request.json.get('deadline')
        
        if not deadline:
            deadline = None
        
        print(git)
        
        acc = AccountModel.query.filter_by(user_id = id).first()
        
        if not acc:
            db.session.close()
            return jsonify({'message' : "User does not exists", 'status' : 404})
        elif acc.user_pwd != pwd:
            return jsonify({'message' : "Wrong Passsword", 'status' : 409})
        else:
            prj = ProjectModel(project_name = name, project_descrp = descrp, project_author = id)
            db.session.add(prj)
            db.session.commit()
            
            skills = request.json.get('skills')          
            for skill in skills:
                temp = create_table_class(skill)
                temp1 = temp(project_name = prj.project_id)
                
                db.session.add(temp1)
                db.session.commit()
                
            results = mongo_account_data.find_one({"user_id": id})
            results['Projects'].append(prj.project_id)
            mongo_account_data.update_one({"user_id": id}, {'$set': results})
            
            data = {'_id':prj.project_id, 'Project_name':name, 'Project_descrp':descrp, 'Project_author':id, 'Skills':skills, 'Contributors':[], 'Features':{}, 'Messages':[], 'Project_URL':git, 'Requests':[], 'Deadline':deadline}
            mongo_project_data.insert_one(data)
            
            return jsonify({'message' : "Successfull", 'status' : 200})
        
class PostProjectMessage(Resource):
    def post(self):
        project_id = request.json.get('project_id')
        id = request.json.get('sender_id')
        message = request.json.get('message')
        pwd = request.json.get('pwd')
        acc = AccountModel.query.filter_by(user_id = id).first()
        print(id)
        if not acc:
            db.session.close()
            print(1)
            return jsonify({'message' : "User does not exists", 'status' : 404})
        elif acc.user_pwd != pwd:
            print(2)
            return jsonify({'message' : "Wrong Passsword", 'status' : 409})
        else:
            project = mongo_project_data.find_one({'_id': project_id})

            if not project:
                print(5)
                return jsonify({'message': 'Project not found', 'status': 404})

            if id != project['Project_author'] and id not in project['Contributors']:
                print(6)
                return jsonify({'message': 'Unauthorized access', 'status': 403})


            project['Messages'].append({
                'sender': id,
                'message': message,
                'timestamp': datetime.datetime.now().isoformat()
            })

            mongo_project_data.update_one({'_id': project_id}, {'$set': project})

            print(3)
            return jsonify({'message': 'Message posted successfully', 'status': 200})
        

class AddContributorResource(Resource):
    def post(self):
        project_id = request.json.get('project_id')
        contributor_id = request.json.get('contributor_name')
        id = request.json.get('id')
        pwd = request.json.get('pwd')
        
        print(contributor_id)
        
        acc = AccountModel.query.filter_by(user_id = id).first()
        
        if not acc:
            db.session.close()
            return jsonify({'message' : "User does not exists", 'status' : 404})
        elif acc.user_pwd != pwd:
            return jsonify({'message' : "Wrong Passsword", 'status' : 409})
        else:
            acc1 = AccountModel.query.filter_by(user_id = contributor_id).first()
            if not acc1:
                db.session.close()
                return jsonify({'message' : "User does not exists", 'status' : 404})
            else:
                contributor = mongo_account_data.find_one({'user_id': contributor_id})
                if project_id in contributor['Requests']:
                    return jsonify({'message' : "Requests was already sent", 'status' : 200})
                contributor['Requests'].append(project_id)
                mongo_account_data.update_one({'user_id': contributor_id}, {'$set': contributor})
                
                return jsonify({'message' : "Requests sent successfully", 'status' : 200})
            
class AcceptContributorResource(Resource):
    def post(self):
        project_id = request.json.get('project_id')
        id = request.json.get('id')
        pwd = request.json.get('pwd')
        
        acc = AccountModel.query.filter_by(user_id = id).first()
        
        if not acc:
            db.session.close()
            return jsonify({'message' : "User does not exists", 'status' : 404})
        elif acc.user_pwd != pwd:
            return jsonify({'message' : "Wrong Passsword", 'status' : 409})
        else:
            result = mongo_account_data.find_one({'user_id':id})
            if project_id in result['Requests']:
                if project_id not in result['Projects']:
                    result['Requests'].remove(project_id)
                    result['Projects'].append(project_id)
                    
                    mongo_account_data.update_one({'user_id': id}, {'$set': result})
                    
                    temp = mongo_project_data.find_one({'_id':project_id})
                    temp['Contributors'].append(id)
                    mongo_project_data.update_one({'_id': project_id}, {'$set': temp})
                else:
                    result['Requests'].remove(project_id)
                    mongo_account_data.update_one({'user_id': id}, {'$set': result})
                    
                return jsonify({'message' : "Successfully Accepted", 'status' : 200})
            
            else:
                return jsonify({'message' : "Invitation Does not exists", 'status' : 404})
        
class AddFeatureResource(Resource):
    def post(self):
        project_id = request.json.get('project_id')
        feature_data = request.json.get('feature_data')
        id = request.json.get('id')
        pwd = request.json.get('pwd')
        
        acc = AccountModel.query.filter_by(user_id = id).first()
        
        if not acc:
            db.session.close()
            return jsonify({'message' : "User does not exists", 'status' : 404})
        elif acc.user_pwd != pwd:
            return jsonify({'message' : "Wrong Passsword", 'status' : 409})
        else:
            project = mongo_project_data.find_one({'_id': project_id})

            if not project:
                return jsonify({'message': 'Project not found', 'status': 404})

            project['Features'].update(feature_data) 

            mongo_project_data.update_one({'_id': project_id}, {'$set': project})

            return jsonify({'message': 'Features added successfully', 'status': 200})

class ToggleFeatureStatus(Resource):
    def post(self):
        project_id = request.json.get('project_id')
        feature_name = request.json.get('feature_name')
        id = request.json.get('id')
        print(id)
        pwd = request.json.get('pwd')
        print(pwd)
        
        print(feature_name)
        
        acc = AccountModel.query.filter_by(user_id = id).first()
        
        if not acc:
            db.session.close()
            print("User does not exists")
            return jsonify({'message' : "User does not exists", 'status' : 404})
        elif acc.user_pwd != pwd:
            print("Wrong Passsword")
            return jsonify({'message' : "Wrong Passsword", 'status' : 409})
        else:
            project = mongo_project_data.find_one({'_id': project_id})

            if not project:
                print('Project not found')
                return jsonify({'message': 'Project not found', 'status': 404})

            if feature_name not in project['Features']:
                print('Feature not found')
                return jsonify({'message': 'Feature not found', 'status': 404})

            current_status = project['Features'][feature_name]
            new_status = 0 if current_status == 1 else 1 

            project['Features'][feature_name] = new_status

            mongo_project_data.update_one({'_id': project_id}, {'$set': project})

            print("test")
            return jsonify({'message': 'Feature status toggled successfully', 'status': 200})
        
class GetProjectByAuthor(Resource):
    def post(self):
        id = request.json.get('project_author')
        project = list(mongo_project_data.find({'$or': [{'Project_author': id}, {'Contributors': {'$in': [id]}}]}))
        if not project:
            return jsonify({'message': 'Project not found', 'status': 404})
        
        return jsonify({'projects': project, 'status': 200})
    
class GetFeaturesByID(Resource):
    def post(self):
        id = request.json.get('project_id')
        project = mongo_project_data.find_one({'_id': id})

        if not project:
            return jsonify({'message': 'Project not found', 'status': 404})

        print(project)
        return jsonify({'features': project['Features'], 'status': 200})
    
class GetProjectByID(Resource):
    def post(self):
        id = request.json.get('project_id')
        project = mongo_project_data.find_one({'_id': id})

        if not project:
            return jsonify({'message': 'Project not found', 'status': 404})

        print(project)
        return jsonify({'project': project, 'status': 200})
    
class GetContributorsByID(Resource):
    def post(self):
        id = request.json.get('project_id')
        project = mongo_project_data.find_one({'_id': id})

        if not project:
            return jsonify({'message': 'Project not found', 'status': 404})

        print(project['Contributors'])
        return jsonify({'contributors': project['Contributors'], 'status': 200})
    
@app.route('/api/send_code', methods = ['GET'])
def send_code():
    id = request.json.get('id')
    acc = AccountModel.query.filter_by(user_id = id).first()
    
    if not acc:
        db.session.close()
        return jsonify({'message' : "User does not exists", 'status' : 404})
    
    msg = Message(
        subject='Hello from the other side!', 
        sender='testflaskapplication@gmail.com',
        recipients=[str(acc.user_email)]
        )
    code = random.randint(1111,9999)
    msg.body = "Hey, your code to change your password is {}.".format(code)
    mail.send(msg)
    
    acc.pwd_change_code = code
    db.session.commit()
    db.session.close()
    
    return jsonify({'message' : "Successful", 'status' : 200})
    
@app.route('/api/rm_acc', methods = ['POST'])
def remove_acc():
    id = request.json.get('id')
    pwd = request.json.get('pwd')

    acc = AccountModel.query.filter_by(user_id=id).first()

    if not acc:
        return jsonify({'message': "Id does not exist", 'status': 404})
    else:
        if acc.user_pwd == pwd:
            db.session.delete(acc)
            db.session.commit()
            return jsonify({'message': "Account Deleted Successfully", 'status': 200})
        else:
            return jsonify({'message': "Wrong Password", 'status': 409})
        

@app.route('/api/search_projects', methods=['POST'])
def search_projects():
    substring = request.json.get('substring')
    skills = request.json.get('skills')
    if skills:
        skills = list(skills)
    
    query = "SELECT p.project_id, p.project_name, p.project_descrp, p.project_author FROM project_data p "
    
    if skills:
        for skill in skills:
            query += f"LEFT JOIN {skill} ON p.project_id = {skill}.project_name "
    
    conditions = []
    if substring:
        conditions.append(f"p.project_name LIKE '%{substring}%'")
    if skills:
        skill_conditions = " OR ".join([f"{skill}.project_name IS NOT NULL" for skill in skills])
        conditions.append(f"({skill_conditions})")
    
    if conditions:
        query += "WHERE " + " AND ".join(conditions)
    
    try:
        result = g.db_session.execute(text(query))
        projects = [dict(row._mapping) for row in result]
        
        data = []
        
        for i in range(len(projects)):
            temp = projects[i]['project_id']
            data.append(mongo_project_data.find_one({"_id":temp}))
            print(projects[i])
        
        return jsonify({'projects': data, 'status': 200})
    
    except Exception as e:
        return jsonify({'message': str(e), 'status': 500})


@app.route('/api/search_accounts', methods=['POST'])
def search_accounts():
    s = request.json.get('name')
    print(s)
    query = {'user_id': {'$regex': s, '$options': 'i'}} 
    result = mongo_account_data.find(query)
    result_list = [doc for doc in result]
    print(result_list)
    for elem in result_list:
        elem['_id'] = str(elem['_id'])
    return jsonify({'accounts': result_list, 'status': 200})

@app.route('/api/get_skills', methods=['POST'])
def get_skills():
    query = text("SELECT * FROM skills")
    result = g.db_session.execute(query)
    
    try:
        result = g.db_session.execute(query)

        skill = [list(row) for row in result]
        print(skill)
        return jsonify({'skills': skill, 'status': 200})
    
    except Exception as e:
        return jsonify({'message': str(e), 'status': 500})
    
@app.route('/api/send_request', methods=['POST'])
def send_requests():
    id = request.json.get('user_id')
    prj_id = request.json.get('project_id')
    print(id)
    acc = AccountModel.query.filter_by(user_id=id).first()
    
    if not acc:
        return jsonify({'message': "Username does not exists", 'status': 200})

    
    result = mongo_project_data.find_one({'_id':prj_id})
    account = mongo_account_data.find_one({'user_id':id})
    
    print(result)
    if id not in result['Requests']:
        result['Requests'].append(id)
        mongo_project_data.update_one({'_id': prj_id}, {'$set': result})
        
        if prj_id not in account['Pending']:
            account['Pending'].append(prj_id)
            mongo_account_data.update_one({'user_id': id}, {'$set': account})
            
        return jsonify({'message': "Request sent Successfully" ,'status': 200})
    
    else:
        return jsonify({'message': "Request was already sent", 'status': 400})
    
@app.route('/api/accept_request', methods=['POST'])
def accept_requests():
    id = request.json.get('user_id')
    pwd = request.json.get('pwd')
    prj_id = request.json.get('project_id')
    name = request.json.get('name')
    print(name)
    acc = AccountModel.query.filter_by(user_id=id).first()
    
    if not acc:
        return jsonify({'message': "Username does not exists", 'status': 404})
    elif acc.user_pwd != pwd:
        return jsonify({'message': "Incorrect password", 'status': 409})
    
    result = mongo_project_data.find_one({'_id':prj_id})
    
    account = mongo_account_data.find_one({'user_id':name})
    
    if not result:
        return jsonify({'message': "Project does not exists", 'status': 404})
    else:
        result['Requests'].remove(name)
        result['Contributors'].append(name)
        account['Pending'].remove(prj_id)
        mongo_project_data.update_one({'_id': prj_id}, {'$set': result})
        mongo_account_data.update_one({'user_id': name}, {'$set': account})
        return jsonify({'message': "Request was accepted", 'status': 400})
    
    
@app.route('/api/get_github', methods=['POST'])
def add_user_data():
    id = request.json.get('project_id')
    try:
        temp = mongo_project_data.find_one({'_id' : id})
        if temp['Project_URL'] == None:
            return jsonify({"message": "Github data does not exists", "status": 404})
        result = get_repo_data(temp['Project_URL'])
        return jsonify({"message": "Github data retrieved successfully", "status": 200, 'data' : result})
    except Exception as e:
        return jsonify({"message": str(e), "status": 500})
    
@app.route('/api/add_skills', methods=['POST'])
def add_skills():
    id = request.json.get('id')
    pwd = request.json.get('pwd')
    skill = request.json.get('skill')
    try:
        result = mongo_account_data.find_one({'user_id' : id})
        if skill in result['Skills']:
            return jsonify({"message": "Skill already exists", "status": 400})
        else:
            result['Skills'].append(skill)
            return jsonify({"message": "Skill added successfully", "status": 200})
    except Exception as e:
        return jsonify({"message": str(e), "status": 500})
    
class AccountData(Resource):
    def post(self):
        id = request.json.get('user_id')
        result = mongo_account_data.find_one({'user_id': id})
        if not result:
            print('test')
            return jsonify({"message": "ID not found", "status": 404})
        result.pop('_id', None)
        Projects = list(result['Projects'])
        Requests = list(result['Requests'])
        
        query = {'_id': {'$in': Projects}} 
        result1 = mongo_project_data.find(query)
        result1_list = [doc for doc in result1]
        
        result3 = mongo_project_data.find({'_id': {'$in': Requests}})
        result3_list = [doc for doc in result3]
        
        data = []
        for _ in range(len(result['Pending'])):
            data.append(mongo_project_data.find_one({'_id': _}))
        
        if result:
            return jsonify({"message": "Account data retrieved successfully", "status": 200, 'data' : result, 'projects':result1_list, 'requests':result3_list, 'pending':data})
        else:
            return jsonify({"message": "Uccessfull", "status": 400})
        
        
class LLM_chat(Resource):
    def post(self):
        id = request.json.get('user_id')
        pwd = request.json.get('pwd')
        project_id = request.json.get('project_id')
        prompt = request.json.get('prompt')
        
        result = mongo_project_data.find_one({'_id': project_id})
        # git_repo = result['Github']
        
        # return jsonify({"message": "Successful", "status": 200, 'response' : "Hii \n This is a new line"})
        
        if not result:
            return jsonify({"message": "Project not found", "status": 404})
        
        git = str(result['Project_URL'])
        
        download_github_repo(git)
        context = read_py_files()
        response = ask_groq_api(prompt, context)

        print(type(response))
        
        if result:
            return jsonify({"message": "Successful", "status": 200, 'response' : response})
        else:
            return jsonify({"message": "Uccessfull", "status": 400})
        
@app.route('/api/change_acc_details', methods=['POST'])
def change_acc_details():
    id = request.json.get('user_id')
    pwd = request.json.get('pwd')
    email = request.json.get('email')
    number = request.json.get('mobile')
    github = request.json.get('github')
    linkedin = request.json.get('linkedin')
    college = request.json.get('college_name')
    degree = request.json.get('degree')
    about = request.json.get('about')
    
    
    acc = AccountModel.query.filter_by(user_id=id).first()
    
    if not acc:
        return jsonify({"message": "Account not fount", "status": 404})
    elif acc.user_pwd != pwd:
        return jsonify({"message": "Incorrect", "status": 404})
    else:
        m_acc = mongo_account_data.find_one({'user_id':id})
        
        if email:
            acc.user_email = email
            m_acc['Email'] = email
        
        if number:
            acc.user_mobile = number
            
        if github:
            m_acc['github'] = github
            
        if linkedin:
            m_acc['Linkedin'] = linkedin
            
        if college:
            m_acc['College_name'] = college
            
        if degree:
            m_acc['Degree'] = degree
            
        if about:
            m_acc['about'] = about
            
        mongo_account_data.update_one({'user_id':id},{'$set':m_acc})
            
        db.session.commit()
        db.session.close()
        return jsonify({"message" : "Successful", 'status' : 200})
        
           
api.add_resource(LoginResource, '/api/login')
api.add_resource(RegisterResource, '/api/register')
api.add_resource(PasswordChangeResource, '/api/pwd_reset')
api.add_resource(ProjectRegisterResource, '/api/project_register')
api.add_resource(AddContributorResource, '/api/add_contributor')
api.add_resource(AcceptContributorResource, '/api/accept_contributor')
api.add_resource(AddFeatureResource, '/api/add_feature')
api.add_resource(ToggleFeatureStatus, '/api/toggle_feature')
api.add_resource(GetProjectByAuthor, '/api/project')
api.add_resource(PostProjectMessage, '/api/post_message')
api.add_resource(AccountData, '/api/get_account')
api.add_resource(GetFeaturesByID, '/api/get_features')
api.add_resource(GetContributorsByID, '/api/get_contributors')
api.add_resource(GetProjectByID, '/api/get_project_id')
api.add_resource(LLM_chat, '/api/llm_chat')

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')