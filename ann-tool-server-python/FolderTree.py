import json
import os

class FolderTree:
    def __init__(self, path):
        super().__init__()
        self.name = os.path.basename(path)
        self.path = path
        self.isdir = os.path.isdir(path)
        self.children = []
        self.parent = None
    
    def add_child(self, child):
        child.parent = self
        self.children.append(child)
    
    def add_children(self, children):
        for child in children:
            self.add_child(child)
    
    def to_json(self):
        return {"name":self.name,
        "path":self.path,
        "isdir":self.isdir,
        "children": list(map(lambda x: x.to_json(), self.children))
        }

def initializeTree(path:str)-> FolderTree:
    node = FolderTree(path)
    if not os.path.isdir(path):
        return node
    else:
        for file in os.listdir(path):
            node.add_child(initializeTree(os.path.join(path, file)))
        return node

def displayTree(level, tree:FolderTree)->None:
    print(level, tree.name)
    for child in tree.children:
        displayTree(level+'-', child)

if __name__ == "__main__":
    path = '/home/likith/Documents/parsing/resumes/testSheets'
    print('', initializeTree(path).to_json())