import os
import json
import re
import subprocess
import joblib
from pkg_resources import WorkingSet
import uvicorn
import preprocessor

from FolderTree import FolderTree, initializeTree
from ast import literal_eval
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request, Response, FastAPI, File, UploadFile, Form

app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost:5000",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

workspace = '/var/lib/anntool/'
if not os.path.exists(workspace):
    os.makedirs(workspace)

@app.post('/fileUpload')
async def fileUpload(folder:str = Form(...), file: UploadFile = File(...)):
    contents = await file.read()
    contents = contents.decode('utf-8','ignore')
    actual_filename = os.path.splitext(file.filename)[0]
    folder = os.path.join(workspace, folder)
    with open(os.path.join(folder, actual_filename+'.json'), 'w+') as f:
        f.write(preprocessor.process_text(contents))
    print(os.path.join(folder, actual_filename))
    return {file.filename:True}

@app.post('/createFolder')
def createFolder(folder:str=Form(...)):
    os.mkdir(os.path.join(workspace, folder))
    return {folder:True}

@app.get('/folderTree')
def getFolderTree():
    data = {}
    for folder in os.listdir(workspace):
        data[folder] = os.listdir(os.path.join(workspace, folder))
    return data

@app.get('/{folder}/{file}')
def getHome(folder, file):
    file = os.path.join(workspace, f'{folder}/{file}')
    with open(file) as f:
        return json.loads(f.read())

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8080,reload=True)