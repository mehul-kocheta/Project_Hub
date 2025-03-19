import os
import requests
import git
from groq import Groq

def download_github_repo(repo_url):
    local_dir = r"C:\Users\mehul\OneDrive\Desktop\Project Hub\repo_test"
    if os.path.exists(local_dir): 
        os.system(f'rmdir /S /Q "{local_dir}"')
    git.Repo.clone_from(repo_url, local_dir)

def read_py_files():
    local_dir = r"C:\Users\mehul\OneDrive\Desktop\Project Hub\repo_test"
    py_files_content = ""
    for root, dirs, files in os.walk(local_dir):
        for file in files:
            if file.endswith(".py"):
                with open(os.path.join(root, file), 'r') as f:
                    py_files_content += f.read() + "\n"
    return py_files_content

def ask_groq_api(prompt, context):
    client = Groq(api_key=os.environ['GROQ_API_KEY'])
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"{prompt}\n\nContext:\n{context}",
            }
        ],
        model="llama-3.1-8b-instant",
    )
    return chat_completion.choices[0].message.content
