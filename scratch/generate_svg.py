import urllib.request
import zlib
import base64
import os

def generate_kroki(mermaid_code, filename):
    compressed = zlib.compress(mermaid_code.encode('utf-8'), 9)
    b64 = base64.urlsafe_b64encode(compressed).decode('ascii')
    url = f"https://kroki.io/mermaid/png/{b64}"
    output_path = rf"C:\Users\ADMIN\.gemini\antigravity\brain\0f358b46-fba2-4c22-810a-f5053af73780\artifacts\{filename}"
    
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            with open(output_path, 'wb') as f:
                f.write(response.read())
        print(f"Successfully generated PNG at: {output_path}")
    except Exception as e:
        print(f"Failed to generate diagram via Kroki API: {e}")

pie_chart = """pie title "Plagiarism Scan Outcomes (Test Phase)"
    "Original Content (Passed)" : 85
    "Exact Duplicates (Blocked)" : 12
    "High Similarity (Flagged)" : 3
"""

generate_kroki(pie_chart, "plagiarism_pie_chart.png")

dept_chart = """xychart-beta
    title "User Engagement (Avg Daily Uploads by Dept)"
    x-axis ["Computer Science", "Engineering", "Business", "Arts"]
    y-axis "Daily Uploads" 0 --> 150
    bar [120, 95, 60, 45]
"""
generate_kroki(dept_chart, "engagement_chart.png")

