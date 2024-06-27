from bs4 import BeautifulSoup
import requests

def convert_absolute_to_relative(html_content, base_url):
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Convert absolute links in href attributes
    for link in soup.find_all('a', href=True):
        href = link['href']
        if href.startswith(base_url):
            relative_path = href[len(base_url):]
            link['href'] = relative_path
    
    # Convert absolute links in src attributes
    for img in soup.find_all('img', src=True):
        src = img['src']
        if src.startswith(base_url):
            relative_path = src[len(base_url):]
            img['src'] = relative_path
    
    return str(soup)

def main():
    base_url = "https://www.decisionprofessionals.com//"
    html_file = "index.html"
    output_file = "dave_index_file.html"
    
    with open(html_file, 'r', encoding='utf-8') as file:
        html_content = file.read()
    
    updated_html_content = convert_absolute_to_relative(html_content, base_url)
    
    with open(output_file, 'w', encoding='utf-8') as file:
        file.write(updated_html_content)
    
    print(f"Converted HTML saved to {output_file}")

if __name__ == "__main__":
    main()
