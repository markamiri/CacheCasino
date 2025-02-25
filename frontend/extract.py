import json

def extract_markets(json_file):
    with open(json_file, 'r') as f:
        data = json.load(f)

    extracted_data = []

    for section in data['data']['page']['defaultChild']['sectionChildren']:
        # Check if 'drawerChildren' exists in the section
        if 'drawerChildren' not in section:
            continue  # Skip this section if 'drawerChildren' is missing

        for drawer in section['drawerChildren']:
            # Check if 'marketplaceShelfChildren' exists in the drawer
            if 'marketplaceShelfChildren' not in drawer:
                continue  # Skip this drawer if 'marketplaceShelfChildren' is missing

            for shelf in drawer['marketplaceShelfChildren']:
                if "markets" in shelf:
                    event = shelf.get('fallbackEvent', {})
                    markets = shelf.get('markets', [])

                    # Extract relevant data
                    extracted_data.append({
                        "event_name": event.get('name', 'Unknown Event'),
                        "status": event.get('status', 'Unknown Status'),
                        "start_time": event.get('startTime', 'Unknown Time'),
                        "markets": [{
                            "market_name": market.get('name', 'Unknown Market'),
                            "selections": [{
                                "name": selection['name']['fullName'],
                                "odds": selection['odds']['formattedOdds'],
                                "type": selection.get('type', 'Unknown Type')
                            } for selection in market.get('selections', [])]
                        } for market in markets]
                    })

    return extracted_data

# Process the JSON file
try:
    markets_data = extract_markets('graphql_response.json')

    # Save processed dat
  # Save processed data to a new file
    with open('processed_markets.json', 'w') as f:
        json.dump(markets_data, f, indent=4)

    print("Extracted data saved to processed_markets.json.")
except KeyError as e:
    print(f"KeyError: {e}. Please check the JSON structure.")
except Exception as e:
    print(f"An error occurred: {e}")