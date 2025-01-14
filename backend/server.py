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
    
    # Dynamically create the class
    class DynamicTable(Base):
        __tablename__ = skill
        project_name = Column(Integer, primary_key=True)
        
    dynamic_classes[class_name] = DynamicTable
    
    return DynamicTable

    
with app.app_context():
    db.create_all()
    
@app.before_request
def before_request():
    # Create a new session before each request
    g.db_session = Session()

@app.teardown_request
def teardown_request(exception=None):
    # Close the session after the request is finished
    if hasattr(g, 'db_session'):
        g.db_session.close()

class LoginResource(Resource):
    def post(self):
        id = request.json.get('id')
        pwd = request.json.get('pwd')
        
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
        
        results = AccountModel.query.filter_by(user_id = id).first()
        if results:
            return jsonify({"message" : "User already exists", 'status' : 409})
        
        acc = AccountModel(user_id = id, user_pwd = pwd, user_email = email, user_mobile = number)
        db.session.add(acc)
        db.session.commit()
        
        data = {'user_id':id, 'Friend':[], 'Projects':[]}
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
            
            data = {'_id':prj.project_id, 'Project_name':name, 'Project_descrp':descrp, 'Project_author':id, 'Skills':skills, 'Contributors':[], 'Features':{}, 'Messages':[], 'Project_URL':git}
            mongo_project_data.insert_one(data)
            
            return jsonify({'message' : "Successfull", 'status' : 200})
        
class PostProjectMessage(Resource):
    def post(self):
        project_id = request.json.get('project_id')
        id = request.json.get('sender_id')
        message = request.json.get('message')
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

            if id != project['Project_author'] and id not in project['Contributors']:
                return jsonify({'message': 'Unauthorized access', 'status': 403})


            project['Messages'].append({
                'sender': id,
                'message': message,
                'timestamp': datetime.datetime.now().isoformat()
            })

            mongo_project_data.update_one({'_id': project_id}, {'$set': project})

            return jsonify({'message': 'Message posted successfully', 'status': 200})
        
class AddContributorResource(Resource):
    def post(self):
        project_id = request.json.get('project_id')
        contributor_id = request.json.get('contributor_id')
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
            elif project['Project_author'] != id:
                return jsonify({'message': "You're not the author", 'status': 409})

            if contributor_id in project['Contributors']:
                return jsonify({'message': 'Contributor already added', 'status': 409})

            project['Contributors'].append(contributor_id)
            mongo_project_data.update_one({'_id': project_id}, {'$set': project})

            return jsonify({'message': 'Contributor added successfully', 'status': 200})
        
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
    def put(self):
        project_id = request.json.get('project_id')
        feature_name = request.json.get('feature_name')
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

            if feature_name not in project['Features']:
                return jsonify({'message': 'Feature not found', 'status': 404})

            current_status = project['Features'][feature_name]
            new_status = 0 if current_status == 1 else 1 

            project['Features'][feature_name] = new_status

            mongo_project_data.update_one({'_id': project_id}, {'$set': project})

            return jsonify({'message': 'Feature status toggled successfully', 'status': 200})
        
class GetProjectByAuthor(Resource):
    def post(self):
        id = request.json.get('project_author')
        print(id)
        project = list(mongo_project_data.find({'Project_author': id}))
        print(project)
        if not project:
            return jsonify({'message': 'Project not found', 'status': 404})

        print(project)
        return jsonify({'projects': project, 'status': 200})
    
class GetProjectByID(Resource):
    def post(self):
        id = request.json.get('project_id')
        project = mongo_project_data.find_one({'_id': id})

        if not project:
            return jsonify({'message': 'Project not found', 'status': 404})

        print(project)
        return jsonify({'features': project['Features'], 'status': 200})
    
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
    
    query = "SELECT p.project_name, p.project_descrp, p.project_author FROM project_data p "
    
    for skill in skills:
        query += f"INNER JOIN {skill} ON p.project_id = {skill}.project_name "
    
    query += f"WHERE p.project_name LIKE '%{substring}%'"
    
    try:
        print(query)
        result = g.db_session.execute(text(query))
        print(result)
        projects = [dict(row._mapping) for row in result]
        return jsonify({'projects': projects, 'status': 200})
    
    except Exception as e:
        return jsonify({'message': str(e), 'status': 500})

@app.route('/api/get_skills', methods=['POST'])
def get_skills():
    query = text("SELECT * FROM skill")
    result = g.db_session.execute(query)
    
    try:
        result = g.db_session.execute(query)

        skill = [row[0] for row in result]
        return jsonify({'skills': skill, 'status': 200})
    
    except Exception as e:
        return jsonify({'message': str(e), 'status': 500})
    
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
    
class AccountData(Resource):
    def put(self):
        id = request.json.get('user_id')
        result = mongo_account_data.find_one({'user_id': id})
        
        if result:
            return jsonify({"message": "Account data retrieved successfully", "status": 200, 'data' : result})
        else:
            return jsonify({"message": "Uccessfull", "status": 400})
        
           
api.add_resource(LoginResource, '/api/login')
api.add_resource(RegisterResource, '/api/register')
api.add_resource(PasswordChangeResource, '/api/pwd_reset')
api.add_resource(ProjectRegisterResource, '/api/project_register')
api.add_resource(AddContributorResource, '/api/add_contributor')
api.add_resource(AddFeatureResource, '/api/add_feature') #post
api.add_resource(ToggleFeatureStatus, '/api/toggle_feature')
api.add_resource(GetProjectByAuthor, '/api/project')
api.add_resource(PostProjectMessage, '/api/post_message')
api.add_resource(AccountData, '/api/get_account')
api.add_resource(GetProjectByID, '/api/get_features')

if __name__ == "__main__":
    app.run(debug=True)