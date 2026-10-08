# Valid Accounts

Technique ID: T1078
Tactic: Defense Evasion

## Description

Adversaries may use legitimate credentials to access systems.

## Indicators

- Login from an unusual location
- Login at an unusual time
- New device
- Unexpected privileged account usage
- Suspicious activity after authentication

## Investigation

- Identify the user.
- Identify the source IP.
- Check historical login behavior.
- Check device information.
- Review activity after login.

## Response

- Verify whether the login was legitimate.
- Reset credentials if compromise is confirmed.
- Revoke active sessions.
- Enable MFA.