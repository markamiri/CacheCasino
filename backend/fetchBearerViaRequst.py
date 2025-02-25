import requests

def fetch_bearer_token_via_requests():
    # Proxy configuration
    proxy_url = "http://hxz9qgkiv1ihrxp-country-ca-state-ontario-session-9bae8zmopc-lifetime-1:t6bbs2ddwi3qq8g@rp.scrapegw.com:6060"
    proxies = {
        "http": proxy_url,
        "https": proxy_url,
    }

    # Headers required for the request
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "Referer": "https://thescore.bet/",
    }

    # Make the request to the relevant endpoint
    try:
        response = requests.get(
            "https://sportsbook-tsb.ca-on.thescore.bet/graphql/persisted_queries/1dbef7dadc3f48c7e02cdaf86376600c88d821ed83e32051a0e5c8ab1ffad89e?operationName=Marketplace&variables=%7B%22includeSectionDefaultField%22%3Atrue%2C%22includeDefaultChild%22%3Atrue%2C%22includeTableMarketCard%22%3Atrue%2C%22isAdhocCarouselEnabled%22%3Afalse%2C%22isCfpRankingEnabled%22%3Atrue%2C%22includeStandardizedBoxscore%22%3Afalse%2C%22isBrandingImageEnabled%22%3Afalse%2C%22isNewFeaturedBetParticipantLogoEnabled%22%3Afalse%2C%22isNewPropsCarouselParticipantLogoEnabled%22%3Afalse%2C%22canonicalUrl%22%3A%22%2Fsport%2Fbasketball%2Forganization%2Funited-states%2Fcompetition%2Fnba%2Fevent%2Fb3adb95c-7f83-4980-b22f-9121db598fee%22%2C%22filterInput%22%3Anull%2C%22oddsFormat%22%3A%22EURO%22%2C%22pageType%22%3A%22PAGE%22%2C%22includeRichEvent%22%3Atrue%2C%22includeMediaUrl%22%3Afalse%2C%22selectedFilterId%22%3A%22%22%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%221dbef7dadc3f48c7e02cdaf86376600c88d821ed83e32051a0e5c8ab1ffad89e%22%7D%7D",
            headers=headers,
            proxies=proxies,
        )

        # Check for the token in the response headers or body
        if response.status_code == 200:
            bearer_token = response.headers.get("x-anonymous-authorization")
            if bearer_token:
                print("Bearer Token:", bearer_token)
                return bearer_token
            else:
                print("Bearer token not found in response headers.")
        else:
            print(f"Failed to fetch token: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error fetching token: {e}")

# Call the function
fetch_bearer_token_via_requests()
