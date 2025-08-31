from datetime import datetime
import os, pytz

os.chdir(os.path.dirname(os.path.abspath(__file__)))

project = "SecurityProject"
branch = "main"
try:
  if input("Did you have a git repo installed? (y/n): ").lower()[0] == "n":
    os.system(f'''
      git init && \
      git remote add origin git@github.com:mido-ghanam/{project}.git
    ''')
except:
  pass

q = input("Adding a commit message? (Skip available): ")

commit_msg = f"| {datetime.now(pytz.timezone('Africa/Cairo')).strftime('%d-%m-%Y | %H:%M:%S')} | {q} |" if q else f"| {datetime.now(pytz.timezone('Africa/Cairo')).strftime('%d-%m-%Y | %H:%M:%S')} |"

os.system(f'''
git add . && \
git commit -m "{commit_msg}" && \
git branch -M {branch} && \
git push -u origin {branch}
''')

#git clone git@github.com:mido-ghanam/SecurityProject.git 
