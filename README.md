### auth/refresh endpoint
- new access token new payload must be from database
not from the refresh token payload for any updated that may occur to user role in the system especially in the case of restaurant user
- But if refresh token data is useless why storing role and email in it, just stored user to access record in DB or cache
