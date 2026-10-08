# Brute Force

Technique ID: T1110
Tactic: Credential Access

## Description

Adversaries may repeatedly attempt authentication to obtain valid
credentials.

## Indicators

- Multiple failed login attempts
- Repeated authentication attempts
- Password spraying
- Successful login after repeated failures
- Multiple source IP addresses

## Investigation

1. Identify the affected account.
2. Identify the source IP.
3. Count failed attempts.
4. Check whether authentication succeeded.
5. Check login location.
6. Review activity after successful authentication.

## Mitigation

- Enable MFA.
- Use strong passwords.
- Implement authentication throttling.
- Monitor failed login attempts.
- Investigate suspicious source IP addresses.