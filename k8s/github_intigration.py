import requests

def get_repo_info(owner, repo):
    url = f"https://api.github.com/repos/{owner}/{repo}"
    headers = {"Accept": "application/vnd.github+json"}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}")
        return None
    
def get_collaborators(collaborators_url):
    response = requests.get(collaborators_url)
    if response.status_code == 200:
        return [collaborator["login"] for collaborator in response.json()]
    else:
        return []

def get_languages(languages_url):
    response = requests.get(languages_url)
    if response.status_code == 200:
        return list(response.json().keys())
    else:
        return []

def get_open_issues(owner, repo):
    url = f"https://api.github.com/repos/{owner}/{repo}/issues?state=open"
    headers = {"Accept": "application/vnd.github+json"}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}")
        return []

def get_repo_data(repo_url):
    if not repo_url:
        return None
    owner, repo = repo_url.split("/")[-2:]
    repo_info = get_repo_info(owner, repo)
    data = {}
    if repo_info:
        data = {
            "Github URL": repo_url,
            "Project name": repo_info["name"],
            "Project owner": repo_info["owner"]["login"],
            "List users with access": get_collaborators(repo_info["collaborators_url"].split("{")[0]),  # remove template part of URL
            "Programming languages used": get_languages(repo_info["languages_url"]),
            "Security/visibility level": repo_info["visibility"],
            "Summary": repo_info["description"],
            "Last maintained": repo_info["pushed_at"],
            "Last release": repo_info["default_branch"],
            "Open issues": get_open_issues(owner, repo),
        }
        
    return data