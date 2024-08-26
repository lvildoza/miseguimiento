from pymongo import MongoClient

client = MongoClient("mongodb+srv://qa:password1234@cluster0.vk7t4ef.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

db = client.seguimiento_BACKEND

collection_name = db["seguimiento_collection"]
usercollection_name = db["users_collection"]