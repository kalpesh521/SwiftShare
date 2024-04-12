
import firebase_admin
from firebase_admin import credentials ,firestore

cred = credentials.Certificate(r"D:\Big Data\ShareLink\Backend\firebase-adminsdk.json")
firebase_admin.initialize_app(cred)

db =firestore.client() 
data={
    
    'name':'Kalpesh',
    'email':'kalpeshpawar7875@gmail.com',
}
doc_ref =db.collection("info").document()
doc_ref.set(data)
print('Document ID :', doc_ref.id)