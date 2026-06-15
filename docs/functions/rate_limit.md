# Login Rate Limiting

*Version added: v1.5.0*

Tactical RMM includes rate limiting protection on the login flow to help prevent automated brute-force attacks.

The login flow has two protected steps:

1. **Password verification step**: The user submits their username and password.
2. **Two-factor login step**: After the password is verified, the user submits their TOTP code to complete login.

Rate limits are applied per client IP address and are enforced automatically.

## Default Limits

By default, Tactical RMM allows:

| Setting | Login Step | Default Limit |
|---|---|---|
| `TRMM_CHECK_CREDS_MIN_THROTTLE` | Password verification | 10 requests per minute |
| `TRMM_CHECK_CREDS_DAY_THROTTLE` | Password verification | 300 requests per day |
| `TRMM_LOGIN_MIN_THROTTLE` | Two-factor login | 10 requests per minute |
| `TRMM_LOGIN_DAY_THROTTLE` | Two-factor login | 300 requests per day |

If a client exceeds one of these limits, Tactical RMM will temporarily reject additional requests and return an HTTP 429 response.

## Customizing Rate Limits

Rate limits can be customized by adding the following variables to `/rmm/api/tacticalrmm/tacticalrmm/local_settings.py`

Example:

```python
TRMM_CHECK_CREDS_MIN_THROTTLE = 10
TRMM_CHECK_CREDS_DAY_THROTTLE = 300
TRMM_LOGIN_MIN_THROTTLE = 10
TRMM_LOGIN_DAY_THROTTLE = 300
```

The values represent the number of allowed requests for each time window.

For example:

```python
TRMM_CHECK_CREDS_MIN_THROTTLE = 10
```

allows 10 password verification requests per minute per client IP address.

After adding/editing values, run `sudo systemctl restart rmm.service` for changes to take effect.

## Viewing Current Rate Limits

Run the following management command to view all currently active rate limit entries:

```bash
/rmm/api/env/bin/python /rmm/api/tacticalrmm/manage.py show_throttles
```

Example output:

```text
Status       Throttle           Client             Attempts     Remaining  Retry After
------------------------------------------------------------------------------------------
OK           check_creds_min    203.0.145.10       2/10 per minute          8          -
THROTTLED    check_creds_min    203.0.134.10       10/10 per minute          0          42s
OK           login_day          203.0.145.10       26/300 per day          274        -
```

### Output Explanation

| Column | Description |
|---|---|
| Status | Whether the client is currently rate limited |
| Throttle | The specific rate limit being tracked |
| Client | Client IP address |
| Attempts | Current requests within the active window |
| Remaining | Number of requests remaining before the limit is reached |
| Retry After | How long until requests are allowed again if currently rate limited |

## Clearing Rate Limits

Rate limit data is stored in Tactical RMM's cache.

If you need to immediately clear all active rate limits, you can either:

### From the Web UI

Navigate to:

```text
Tools > Clear Cache
```

### From the Command Line

Run:

```bash
/rmm/api/env/bin/python /rmm/api/tacticalrmm/manage.py clear_db_cache
```

This clears all cached rate limit entries and immediately resets any active rate limiting.

## Notes

- Rate limits are tracked per client IP address.
- Both successful and failed login attempts count toward the limit.
- The password verification step and two-factor login step are tracked separately.
- Limits automatically expire and reset based on their configured time window.
- Clearing the cache removes all active rate limit entries.