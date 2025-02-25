import requests
import json

def fetch_marketplace_data(canonical_url):
    # Base URL for the GraphQL endpoint
    url = "https://sportsbook-tsb.ca-on.thescore.bet/graphql/persisted_queries/1dbef7dadc3f48c7e02cdaf86376600c88d821ed83e32051a0e5c8ab1ffad89e"

    # Headers copied from the Network tab
    headers = {
    "x-anonymous-authorization": "Bearer eyJhbGciOiJSU0EtT0FFUCIsImVuYyI6IkExMjhDQkMtSFMyNTYifQ.hKu_huo8-E8f2Q7cHy1KxM1Q19OEmM1Q5HevfPBnRskQbrCgDp_UkXWx-QdVcy8ZLSV1bVyKf_4OkJvfMuE-6wic-uqGw24gVMYkkspFt_Y-mJtmuvIRwiuUYyX7wqfPAsugghrOG0qcWQpsOpmIuumkHgiZEJkycD_NuAfR5DhO93R67pzfu5Crqz-iv9XB3lm_-FM23RnxugF_TI3UJnD9JSFcW9eLgrQ9Pnuw9zvRfEfTZV7hco9GcdOM93hNEwZQ8HurgWzXVkCH2fWYitoBK1xbdk4JI1e0N85UQdgNYHUX2Yve6Y0SdxaoC6D6vnVger5DmjPcPSEMdm-6ZjP1_9-4bAvh7s47qcdi6DtT_HPsjj5oO76pTBz4dQHRAsjEE31f_Du-RZMlZhkGLkr3LbVI6PPIshxfY8rr48LlynnZP_Nm9NwuoZi3Mutlre1SrKxEhxQGA_2A53f-wt77GqWHXRJd2E-r2Q5cFGqAKnx9f7yRqG__5m2o_kUoanvXVMUNt_SueIPU1wWK5S6TL1qidujsYoeIieFeZhhWb1KhS3_y-mT8xujdIPzDpZDx176afgGp00-iYpRdWnXXRpfPiDVUe7_eiiSFKb6tFOGoTMqpw8gU0-q7oF8B38eyNJgY9xxf4RsPsauBBh0zBihk75-oWwlkmCIeU2I.8WH0jqNapue5Xwbcvw6xGw.y-3Veh41O0ZyfoqsAmptWt6_7ZrpeMXQTyp3fFoSBf5qUzUIFswmefogvIpaxjHhJH057uZKYreJJ6uEQw7gNtui5wfu4Pk4E6f4K3Ie5Zb692rNn357aeyEJ1Of0IEu1A5KLs399kBwF-xDprWuIN6MSdZjOIVTednpCikuMSuy8qfgdl_qWWoXCpc04999xf_0SFFAcec919wc-eKN7BK3sEy7iiDxhqh2eMte8tRw70lFLfDlKfhfJDB4OlfyJTLsYKQl48xwyNZfRmISJA.B_zNlQQbvuy4o0O87ZVOXw",
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Referer": "https://thescore.bet/",
    "accept": "application/json",
    "origin": "https://thescore.bet",
    "cookie": "__cf_bm=...; _cfuvid=...; _gcl_au=...; thescore_id_web_bettingthescore.bet=...",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "priority": "u=1, i",
    "x-app": "tsb",
    "x-app-version": "25.2.0",
    "x-client": "tsb"
    }


    # JSON payload to send with the POST request
    payload = {
        "operationName": "Marketplace",
        "variables": {
            "includeSectionDefaultField": True,
            "includeDefaultChild": True,
            "includeTableMarketCard": True,
            "isAdhocCarouselEnabled": False,
            "isCfpRankingEnabled": True,
            "includeStandardizedBoxscore": False,
            "isBrandingImageEnabled": False,
            "isNewFeaturedBetParticipantLogoEnabled": False,
            "isNewPropsCarouselParticipantLogoEnabled": False,
            "canonicalUrl": canonical_url,
            "filterInput": None,
            "oddsFormat": "EURO",
            "pageType": "PAGE",
            "includeRichEvent": True,
            "includeMediaUrl": False,
            "selectedFilterId": "",
        },
        "extensions": {
            "persistedQuery": {
                "version": 1,
                "sha256Hash": "1dbef7dadc3f48c7e02cdaf86376600c88d821ed83e32051a0e5c8ab1ffad89e",
            }
        },
    }

    # Send the POST request
    response = requests.post(url, headers=headers, json=payload)

    # Check response status
    if response.status_code == 200:
        # Get the content length
        content_length = len(response.content)
        print(f"Content length: {content_length} bytes")

        # Save the response to a file
        data = response.json()
        with open("response.json", "w") as f:
            json.dump(data, f, indent=4)  # Save the JSON response with indentation
        print("Data saved to response.json")
    else:
        print(f"Error: {response.status_code}")
        print(response.text)



# Example usage
canonical_url="https://thescore.bet/sport/football/organization/united-states/competition/nfl/event/d63be4dd-2ebb-41a1-a348-5c64fc3828bf"
fetch_marketplace_data(canonical_url)