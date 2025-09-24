#!/usr/bin/env python3
"""
Test file with intentional security vulnerabilities for SAST scanning
"""

import os
import subprocess
import sqlite3
from flask import Flask, request

app = Flask(__name__)

# SQL Injection vulnerability
def get_user_data(user_id):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    # Vulnerable: Direct string concatenation allows SQL injection
    query = "SELECT * FROM users WHERE id = " + user_id
    cursor.execute(query)
    return cursor.fetchall()

# Command Injection vulnerability
def process_file(filename):
    # Vulnerable: Direct command execution with user input
    cmd = f"ls -la {filename}"
    result = os.system(cmd)
    return result

# Path Traversal vulnerability
@app.route('/read_file')
def read_file():
    filename = request.args.get('file')
    # Vulnerable: No path validation allows directory traversal
    with open(filename, 'r') as f:
        return f.read()

# Hardcoded credentials (will be caught by secrets scanner too)
DATABASE_PASSWORD = "admin123"
API_KEY = "sk-1234567890abcdef"

# Insecure random number generation
import random
def generate_token():
    # Vulnerable: Using predictable random for security tokens
    return str(random.randint(100000, 999999))

# XSS vulnerability through unsafe template rendering
def render_user_content(content):
    # Vulnerable: Direct HTML rendering without escaping
    return f"<div>{content}</div>"

if __name__ == "__main__":
    # Vulnerable: Debug mode in production
    app.run(debug=True, host='0.0.0.0')