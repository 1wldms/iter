import os
from dotenv import load_dotenv

load_dotenv()

print("supabase_client start")

from supabase import create_client

print("supabase import done")

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)

print("supabase client created")