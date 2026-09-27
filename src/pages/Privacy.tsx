import { Link } from "react-router-dom";
import LegalLayout from "@/components/LegalLayout";

export default function PrivacyPage() {
  return (
    <LegalLayout
      eyebrow="Privacy"
      title="Privacy Policy"
      subtitle="How the Milne Bay Province Division of Education handles information you send to this website."
      updated="September 2026"
      sections={[
        {
          heading: "What this website collects",
          body: (
            <>
              <p>
                This website is an information service. Reading pages, browsing education programs
                and downloading documents does not require you to identify yourself, and we do not
                use advertising or third-party tracking cookies.
              </p>
              <p>We only ask for personal information when you choose to send it to us:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Contact form</strong> — your name, phone number, email address, enquiry
                  category, district, subject and message.
                </li>
                <li>
                  <strong>WhatsApp announcements</strong> — the mobile number you enter, plus the page
                  the signup came from.
                </li>
              </ul>
            </>
          ),
        },
        {
          heading: "Why we collect it",
          body: (
            <>
              <p>
                Information from the contact form is used only to answer your enquiry and to keep a
                record of correspondence, so we can follow up if your issue is not resolved on first
                contact.
              </p>
              <p>
                A mobile number submitted for WhatsApp announcements is used to send official Division
                announcements. It is not used for marketing or passed to third parties.
              </p>
            </>
          ),
        },
        {
          heading: "How long we keep it",
          body: (
            <p>
              Enquiry records are retained for as long as needed to deal with the matter and to meet
              provincial record-keeping obligations, after which they are disposed of securely.
              WhatsApp numbers are retained until you ask us to remove you from the list.
            </p>
          ),
        },
        {
          heading: "Who can see it",
          body: (
            <>
              <p>
                Enquiry and subscriber records are accessible only to Division of Education staff
                who need them to do their work. We do not sell or rent personal information, and we do
                not disclose it to third parties for their own purposes.
              </p>
              <p>
                We may disclose information where required by PNG law, a court order, or a competent
                authority.
              </p>
            </>
          ),
        },
        {
          heading: "Images and documents",
          body: (
            <p>
              Photographs on this site show students, teachers and school communities. Where a person
              is identifiable, we hold consent from the school and, where appropriate, from the
              individual or their guardian. If you believe an image should be removed, please{" "}
              <Link to="/contact">contact the Division</Link> and we will review the request.
            </p>
          ),
        },
        {
          heading: "Your choices and rights",
          body: (
            <>
              <p>You can ask us at any time to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>confirm what information we hold about you;</li>
                <li>correct information that is inaccurate or out of date;</li>
                <li>remove your mobile number from the WhatsApp announcement list; or</li>
                <li>request a copy of, or deletion of, your enquiry record where we are able to do so.</li>
              </ul>
              <p>
                Use the <Link to="/contact">contact form</Link>, email{" "}
                <a href="mailto:info@mbpeducation.gov.pg">info@mbpeducation.gov.pg</a>, or call{" "}
                <a href="tel:+6756411234">+675 641 1234</a>.
              </p>
            </>
          ),
        },
        {
          heading: "Website security and children's information",
          body: (
            <p>
              We restrict administrative access to this website to authorised staff, and passwords
              and access tokens are never published or shared. The site is not intended to collect
              information directly from children. Where student information appears — for example
              published selection lists — it is limited to what the Division is required or permitted
              to publish.
            </p>
          ),
        },
        {
          heading: "Changes to this policy",
          body: (
            <p>
              We may update this policy as services or legal requirements change. The revision date
              at the top of this page shows when it was last reviewed.
            </p>
          ),
        },
      ]}
    />
  );
}
