import httpx

url = "https://httpbin.org/ip"
ca_sticky = "http://hxz9qgkiv1ihrxp:t6bbs2ddwi3qq8g@rp.scrapegw.com:6060"

resp = httpx.get(url, proxy = ca_sticky, timeout=30)
print(resp.json())