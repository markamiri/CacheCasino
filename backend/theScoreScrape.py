import requests
import json
# Base URL for the GraphQL endpoint
url = "https://sportsbook-tsb.ca-on.thescore.bet/graphql/persisted_queries/1dbef7dadc3f48c7e02cdaf86376600c88d821ed83e32051a0e5c8ab1ffad89e"

# Headers copied from the Network tab
headers = {
    "x-anonymous-authorization": "Bearer eyJhbGciOiJSU0EtT0FFUCIsImVuYyI6IkExMjhDQkMtSFMyNTYifQ.NJ945fgW0PO-LkgDnfx3VGbEAimxzbvscHpA2XoiMJeAclWKwNthDqvyXVzIJh7w2cRt-PmkJ1sA1LNplg7HHx_7dBMCunESCw3Shr2b6haoEIFpgR7xhNApuiacOKoGDtTb9rxiRXJHka5FptakTAAWXjiVT17_MytbcknFNM9bjHVAPM-phyTJLj46GS_oqcDZUe-QhgEoBznYHMW3GIwOGo-YMv1k6dDIbdxLTgp4qC4BTaQI-P3Yk4ML4xeffIJjUu__K_ePwPylr9ulWH3pUUIWfzFh27yCqA0aNxa5vJfnyc4re5gAweicg3nD2BVZRIpO5VjCcfnT3-Cyy4GsTXzeMF5kiSGw_ATDLziWbsRUGmdw9uJ1lpqKcZ-tQ9sbBAa8F6xt0Nie84pAaoGuDvgCqFyHQZNUYONsIX2exer5n-iEm_2sbFg4c6SG3eEKYmXIoL3-MWcc444KhmSWjfE0EGKtm5sQxeRfw3w8W0Z_M2CqGvzIm2fXMjsGCGnqgvhNnMJFxmr2__fdyKhPGeU8gqUTCobDnaoD6fgU0XUQjcx6HL6LGKOmq-eNDbtAXzLqsTTIAjODiGaJDZh3mQRIuICNSp18aZ_qaXyvpExZfs7H2YJP1_-CaflUP3eo0EiBLmUupHx2ZPay81VMoZLe6oGtwxz1t_AU5iY.3wONMMCTyYMrXtn23Ntagg.SqO7aJbMjCo6Oe-FxUgUxhSTOdCX5oPCnUPt8wGy4rQueE6A93Z2Bj0XT6o2Vq5G2XxIhAqjtAzXc6OKHldWDbDrljY0upB5ByYfLrdlXSmk4tR9AoKzduCKiwbtJmKBBJPPZ0OCcn4oPM77aHymlpEqtPxSla0bLfGfIt-ManLr8uNmSXjTsDrq9gk3PdikZ5r_WVLV6WyuYqTHshKLRkIlaAtsflZ4343TKP04o5CtpQ59WLDRcXMybPK5MxruLa4Heea6O4vJK22Bm3zthw.Xrdh4bZmhFuQuU2_RNAbQw",  # Replace with your token if required
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Referer": "https://thescore.bet/",
    "accept": "application/json",
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
        "canonicalUrl": "/sport/basketball/organization/united-states/competition/nba/event/871532e4-5076-41fe-82b7-f54672246106",
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
