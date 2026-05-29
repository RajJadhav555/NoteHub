import zipfile
import re
import sys

def extract_text_from_pptx(pptx_path):
    text = []
    try:
        with zipfile.ZipFile(pptx_path, 'r') as z:
            for filename in z.namelist():
                if filename.startswith('ppt/slides/slide') and filename.endswith('.xml'):
                    content = z.read(filename).decode('utf-8')
                    # Extract text inside <a:t> tags
                    matches = re.findall(r'<a:t>(.*?)</a:t>', content)
                    text.extend(matches)
        return ' '.join(text)
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        print(extract_text_from_pptx(sys.argv[1]))
    else:
        print("Please provide a file path")
