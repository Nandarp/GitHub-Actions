import json
from bs4 import BeautifulSoup

def parse_html_report(html_file):
    with open(html_file, 'r') as f:
        soup = BeautifulSoup(f, 'html.parser')

        # Extract relevant information from the HTML report
        # Modify this part according to the structure of your APIdog HTML report
        requests = []
        for row in soup.find_all('tr'):
            request = {}
            cells = row.find_all('td')
            if len(cells) >= 3:
                request['name'] = cells[0].get_text()
                request['method'] = cells[1].get_text()
                request['url'] = cells[2].get_text()
                # You can extract more information as needed
                requests.append(request)

    return requests

def main():
    html_report_file = 'apidog-reports/apidog-report*.html'
    requests = parse_html_report(html_report_file)

    # Convert requests to Newman-compatible format (JSON)
    newman_collection = {
        'info': {'name': 'APIdog Collection'},
        'item': [{'name': req['name'], 'request': {'method': req['method'], 'url': req['url']}} for req in requests]
    }

    # Write the Newman-compatible collection to a JSON file
    with open('converted_collection.json', 'w') as f:
        json.dump(newman_collection, f, indent=4)

if __name__ == '__main__':
    main()
