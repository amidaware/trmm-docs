### Zammad Setup

1. **Install Zammad:**
   Follow the installation instructions provided in the [Zammad documentation](https://docs.zammad.org/en/latest/).

2. **Generate API Token:**
   - Click on your User Initials in Zammad.
   - Navigate to Profile > Token Access.
   - Click "Create".
   - Name the Token "Tactical RMM" and select "Ticket Agent".
   - Click "Create" to generate the token.

3. **Add Customers and Emails:**
   Ensure each customer in Zammad has a corresponding email associated.

---

### Tactical RMM Setup

1. **Add Custom Field in Sites:**
   - Add a custom field under Sites called "Zammad-Email".
   - Populate this field with the corresponding email addresses from Zammad to match up with customers.

2. **Add Webhook:**

   - **URL Pattern:** `https://your_zammad_domain/api/v1/tickets`
   - **Method:** POST

3. **Request Headers:**
   ```json
   {
       "Content-Type": "application/json",
       "Authorization": "Bearer your_generated_token_here"
   }
   ```
   
Replace your_generated_token_here with the actual API token generated from Zammad.

4. **Request Body:**
	```json
	{
   "title": "{{ alert.severity }} on {{ agent.hostname }}",
   "group": "Users",
   "customer": "{{ client.Zammad-Email }}",
   "article": {
      "subject": "{{ alert.severity }} on {{ agent.hostname }}",
      "body": "{{ alert.message }} at {{ alert.alert_time }}",
      "type": "note",
      "internal": false
	}
	}
	```
	- {{ alert.severity }}, {{ agent.hostname }}, {{ alert.message }}, and {{ alert.alert_time }} are placeholders that will be replaced with actual data from Tactical RMM alerts.
	- {{ client.Zammad-Email }} refers to the custom field you added under Sites where you store the corresponding Zammad email for each customer.

5. **Add Webhook to Alert Policy**:

	- Assign the webhook to the appropriate Alert Policy that is assigned to customers in Tactical RMM.
	
### Notes:
	- Ensure that the API token in the Authorization header (Bearer your_generated_token_here) has the necessary permissions (e.g., ticket.agent) to create tickets in Zammad.
	- Adjust the title, group, customer, article fields in the request body as per your specific requirements and Zammad's API capabilities.
	- Test the integration thoroughly to ensure that alerts from Tactical RMM are correctly creating tickets in Zammad with the expected data.
