# Chrome Extension Security Test Report

Generated: 2025-05-30T10:51:16.568Z

## Summary

Total tests run: 30

## Results by Extension

### dom-xss

| Mode | Attack Type | Success Rate | Notes |
|------|-------------|--------------|-------|
| MV2 | dom_xss | 100.0% (3/3) | |
| MV3 | dom_xss | 0.0% (0/3) | Failures: not triggered |

### message-hijack

| Mode | Attack Type | Success Rate | Notes |
|------|-------------|--------------|-------|
| MV2 | priv_esc_msg | 0.0% (0/3) | Failures: not triggered |
| MV3 | priv_esc_msg | 0.0% (0/3) | Failures: not triggered |

### eval-loader

| Mode | Attack Type | Success Rate | Notes |
|------|-------------|--------------|-------|
| MV2 | remote_eval | 0.0% (0/3) | Failures: not triggered |
| MV3 | remote_eval | 0.0% (0/3) | Failures: not triggered |

### keylogger

| Mode | Attack Type | Success Rate | Notes |
|------|-------------|--------------|-------|
| MV2 | keylogger | 0.0% (0/3) | Failures: not triggered |
| MV3 | keylogger | 0.0% (0/3) | Failures: not triggered |

### cookie-hijacker

| Mode | Attack Type | Success Rate | Notes |
|------|-------------|--------------|-------|
| MV2 | cookie_steal | 0.0% (0/3) | Failures: not triggered |
| MV3 | cookie_steal | 0.0% (0/3) | Failures: not triggered |

## Analysis

### Effectiveness of MV3 CSP Protection

- **dom_xss**: MV2 success rate 100.0% → MV3 success rate 0.0% (100.0% improvement)
- **priv_esc_msg**: MV2 success rate 0.0% → MV3 success rate 0.0%
- **remote_eval**: MV2 success rate 0.0% → MV3 success rate 0.0%
- **keylogger**: MV2 success rate 0.0% → MV3 success rate 0.0%
- **cookie_steal**: MV2 success rate 0.0% → MV3 success rate 0.0%
