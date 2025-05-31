# Chrome Extension Security Test Report

Generated: 2025-05-31T03:43:51.273Z

## Summary

Total tests run: 461

## Results by Extension

### unblock-access-control-allow-origin

| Mode | Attack Type | Success Rate | Notes |
|------|-------------|--------------|-------|
| MV2 | cors_bypass | 0.0% (0/31) | Failures: No attack detected, not triggered, Timed out after 30000 ms while trying to connect to the browser! Only Chrome at revision r1045629 is guaranteed to work. |
| MV3 | cors_bypass | 0.0% (0/31) | Failures: No attack detected, not triggered |

### modify-header

| Mode | Attack Type | Success Rate | Notes |
|------|-------------|--------------|-------|
| MV2 | header_modify | 80.0% (24/30) | Failures: No attack detected, not triggered |
| MV3 | header_modify | 29.0% (9/31) | Failures: not triggered |

### dom-xss

| Mode | Attack Type | Success Rate | Notes |
|------|-------------|--------------|-------|
| MV2 | dom_xss | 100.0% (34/34) | |
| MV3 | dom_xss | 0.0% (0/33) | Failures: No attack detected, not triggered |

### message-hijack

| Mode | Attack Type | Success Rate | Notes |
|------|-------------|--------------|-------|
| MV2 | priv_esc_msg | 0.0% (0/33) | Failures: No attack detected, not triggered |
| MV3 | priv_esc_msg | 0.0% (0/33) | Failures: No attack detected, not triggered |

### eval-loader

| Mode | Attack Type | Success Rate | Notes |
|------|-------------|--------------|-------|
| MV2 | remote_eval | 18.2% (6/33) | Failures: not triggered |
| MV3 | remote_eval | 18.2% (6/33) | Failures: not triggered |

### keylogger

| Mode | Attack Type | Success Rate | Notes |
|------|-------------|--------------|-------|
| MV2 | keylogger | 3.0% (1/33) | Failures: No attack detected, not triggered |
| MV3 | keylogger | 0.0% (0/33) | Failures: No attack detected, not triggered |

### cookie-hijacker

| Mode | Attack Type | Success Rate | Notes |
|------|-------------|--------------|-------|
| MV2 | cookie_steal | 17.6% (6/34) | Failures: not triggered |
| MV3 | cookie_steal | 0.0% (0/33) | Failures: No attack detected, not triggered |

### disable-CSP

| Mode | Attack Type | Success Rate | Notes |
|------|-------------|--------------|-------|
| MV2 | csp_bypass | 0.0% (0/3) | Failures: Timed out after 30000 ms while trying to connect to the browser! Only Chrome at revision r1045629 is guaranteed to work. |
| MV3 | csp_bypass | 0.0% (0/3) | Failures: Timed out after 30000 ms while trying to connect to the browser! Only Chrome at revision r1045629 is guaranteed to work., not triggered |

## Analysis

### Effectiveness of MV3 CSP Protection

- **cors_bypass**: MV2 success rate 0.0% → MV3 success rate 0.0%
- **header_modify**: MV2 success rate 80.0% → MV3 success rate 29.0% (51.0% improvement)
- **dom_xss**: MV2 success rate 100.0% → MV3 success rate 0.0% (100.0% improvement)
- **priv_esc_msg**: MV2 success rate 0.0% → MV3 success rate 0.0%
- **remote_eval**: MV2 success rate 18.2% → MV3 success rate 18.2%
- **keylogger**: MV2 success rate 3.0% → MV3 success rate 0.0% (3.0% improvement)
- **cookie_steal**: MV2 success rate 17.6% → MV3 success rate 0.0% (17.6% improvement)
- **csp_bypass**: MV2 success rate 0.0% → MV3 success rate 0.0%
