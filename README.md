# StudySpark

StudySpark is a React/Vite academic-support website with separate Home, About,
Reviews, Experts, Services, Samples, and Blog pages. The Experts page filters
support areas, Samples can be searched and filtered, and Blog articles expand
in place. Its Express API accepts enquiries, stores them in MongoDB, sends
owner notifications by email and WhatsApp, provides a rule-based support
chatbot, and accepts Vapi end-of-call reports.

The page routes are `/`, `/about-us/`, `/reviews/`, `/experts/`, `/services/`,
`/samples/`, and `/blog/`. The older `/free-samples/` path is also supported.

## Run locally

Install dependencies in the project root:

```bash
npm install
```

Copy `.env.example` to `.env` and set the values you use. Run the API and the
frontend in separate terminals:

```bash
npm run dev:api
```

```bash
npm run dev
```

Open the Vite URL (normally `http://localhost:5173`). Vite proxies `/api` to
`http://localhost:5000`. Without a valid `MONGODB_URI`, the API cannot save
enquiries. Email and WhatsApp notifications require their respective Gmail and
Twilio credentials.

Build the website with `npm run build`.

## Contact form notifications

Set `GMAIL_USER`, `GMAIL_APP_PASSWORD`, and `NOTIFY_EMAIL_TO` for owner email.
Set the Twilio WhatsApp credentials and `NOTIFY_WHATSAPP_TO` to notify the
owner's WhatsApp. After saving an enquiry, the API emails the full request and
any uploaded files to the owner, sends every request field to the owner's
WhatsApp (split across messages when needed), and emails a request summary to
the visitor. Each delivery channel is attempted independently; failures are
logged and do not prevent the other channels from being attempted.

The enquiry form accepts up to four PDF, DOC, DOCX, TXT, JPG, or PNG
attachments (5 MB each, 15 MB total). Files are held in memory only while the
request is processed and attached to the owner's notification email; file
contents are not stored in MongoDB or on the web server. WhatsApp notifications
include the request details and attachment names. Configure working Gmail and
Twilio credentials before expecting those notifications to arrive. If email
delivery fails, the API logs the failure and the attachment is not retained.
The API requires the visitor's explicit contact consent and validates request
field formats and lengths on the server. Lead records are not exposed through a
public listing endpoint; use an authenticated admin interface before adding any
lead retrieval feature.

## Feedback and reviews

Feedback submitted on `/reviews/` is stored in the MongoDB `feedbacks`
collection with its rating, message, optional contact details, publication
permission, and a `pending_review` status. It is private by default and is not
automatically shown on the public site. The owner receives the feedback by
email and WhatsApp; if the visitor provides an email, they also receive a
confirmation. The form does not accept file uploads.

## Vapi phone setup

Inbound calls go to the Vapi phone number you configure. Add that number to
`VITE_VAPI_INBOUND_NUMBER` so the site's call buttons use it. In the Vapi
dashboard:

1. Attach your Vapi number to an assistant and set its instructions to answer
   common questions first, then transfer to the owner when it cannot resolve
   the caller's request. For example: "Answer questions about our academic
   guidance clearly. Do not guess prices or promise a deadline. If you cannot
   confidently answer after one clarifying question, or the caller asks for a
   person, use the transferCall tool to connect them to the owner."
2. Add/configure a `transferCall` tool on that assistant with the owner's
   real phone number as its destination. Test the transfer using your Vapi
   account before publishing the number.
3. Set the assistant's server URL to
   `https://YOUR_API_HOST/api/leads/vapi-webhook` and its server URL secret to
   the same value as `VAPI_WEBHOOK_SECRET`.
4. Enable the `end-of-call-report` server event. Vapi sends the call summary
   to the API, which emails it to `NOTIFY_EMAIL_TO`. For calls associated with
   a submitted lead, include `metadata.leadId` to also save the outcome and
   send the configured outcome notifications.

The call links dial the configured Vapi number directly. Make sure that number
is assigned to the assistant with its owner-transfer tool; calls must not
point directly to the owner's number if the assistant is expected to answer
first. Test both a resolved question and an unresolved question/transfer
before publishing.

For optional outbound verification calls after form submissions, set
`ENABLE_VOICE_VERIFICATION=true`, `VAPI_PRIVATE_KEY`, `VAPI_ASSISTANT_ID`, and
`VAPI_PHONE_NUMBER_ID`. The assistant ID used for outbound calls should also
be configured with the transfer behavior described above. Do not expose the
Vapi private API key as a `VITE_` variable.

## Website configuration

The intro is an animated, three-scene welcome experience that plays for five
seconds when a visitor first opens the site in a browser tab and can be skipped
with the button or Escape. Moving between pages in that tab does not show it
again; a new tab/session can show it again. Visitors who prefer reduced motion
see a shorter version.
The animated coupon popup is off by default. To enable and configure it, set
`VITE_OFFER_ENABLED=true` and change `VITE_OFFER_TITLE`,
`VITE_OFFER_DESCRIPTION`, and `VITE_OFFER_CODE`. These frontend settings are
public in the browser bundle, so never put secrets in them.
The light/dark theme follows the visitor's system preference by default and
remembers a manual toggle in that browser.

Set `VITE_CONTACT_EMAIL` and `VITE_WHATSAPP_NUMBER` to show working contact
actions. If no WhatsApp or Vapi inbound number is provided, the corresponding
action directs visitors to the enquiry form instead.
The always-visible top strip shows a sample phone (`+1 (202) 555-0147`) and
email (`hello@studyspark.example`) when real contact details are not configured.
Replace `VITE_CONTACT_PHONE` and `VITE_CONTACT_EMAIL` before publishing. Set
`VITE_VAPI_INBOUND_NUMBER` to your Vapi number so the visible call link routes
through the AI assistant; an unconfigured sample phone does not initiate a
call.
The always-visible top announcement can be customized with
`VITE_TOP_BANNER_TEXT`. It remains concise on smaller screens; configured Vapi
and email contact links appear beside it when provided.

The chatbot currently uses a small built-in FAQ/intent responder and directs
unmatched questions to the enquiry form. It does not claim to be a generative
AI assistant.

## Deploying

Deploy the frontend and Express API with the same domains/configuration
principles as any Vite and Node service. Set `CORS_ORIGIN` to the frontend
origin, configure `MONGODB_URI`, notification credentials, and the Vapi
webhook URL/secret on the API host. For a separately hosted frontend, set
`VITE_LEAD_FORM_ENDPOINT` and `VITE_CHATBOT_API_ENDPOINT` to the API's public
endpoints before building.
