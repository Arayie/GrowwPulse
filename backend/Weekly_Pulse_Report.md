## Top 3 Themes
1. **Double SIP AutoPay Mandate Duplication**: Recurring payment microservice executing SIP mandates twice in a month without authorization.
2. **iOS Candlestick Chart Freezes during Peak F&O**: Post-update UI regression causing charts to freeze on iOS during opening market hours.
3. **Bank Account & Mandate Validation Stalls**: Multi-day delays in bank account verification blocking fund deposits.

## Real User Quotes
> "SIP amount deducted twice this month. Double deduction happened without any reason. User [EMAIL REDACTED] ticket unresolved."
> "Latest update freezes option charts on iOS. Screen goes blank during fast market moves for account [ID REDACTED]."
> "Bank verification stuck for 5 days. Cannot set up AutoPay mandate. Contacted support at [EMAIL REDACTED]."

## Action Ideas
- **Product/Growth**: Build an automated mandate deduplication engine in payment backend services to block double debits.
- **Support**: Deploy hotfix patch optimizing iOS chart rendering pipeline and WebSocket data stream buffers.
- **Leadership**: Automate real-time bank validation via direct NPCI API webhooks to clear KYC bottlenecks.