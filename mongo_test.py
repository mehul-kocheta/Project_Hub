from pymongo import MongoClient

mongo_client = MongoClient("mongodb://localhost:27017/")
mongo_db = mongo_client["project_hub"]
mongo_project_data = mongo_db["project_data"]
mongo_account_data = mongo_db["account"]

sample_project = {
    "name": "Sample Project",
    "description": "This is a sample project.",
    "status": "active"
}
mongo_project_data.insert_one(sample_project)

sample_account = {
    "username": "sample_user",
    "email": "sample_user@example.com",
    "role": "admin"
}
mongo_account_data.insert_one(sample_account)

print("Project Data:")
for project in mongo_project_data.find():
    print(project)

print("Account Data:")
for account in mongo_account_data.find():
    print(account)

mongo_project_data.delete_many({"name": "Sample Project"})
mongo_account_data.delete_many({"username": "sample_user"})