import json
import spacy
from spacy.attrs import LOWER, POS, ENT_TYPE, IS_ALPHA, IS_SPACE

nlp = spacy.load('en_core_web_sm')

def process_text(text):
    entites = []
    doc = nlp(text)
    for e,(i, is_space) in enumerate(zip(doc, doc.to_array([IS_SPACE]))):
        entites.append({'id':e,'marked':False,'text':i.text, 'whitespace':bool(i.whitespace_), 'space':bool(is_space), 'tag':''})
    return json.dumps({'text':text, 'cancelled':False, 'ner':entites, 'rel':[]})