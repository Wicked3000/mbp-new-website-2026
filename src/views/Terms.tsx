"use client";

import Link from "next/link";
import LegalLayout from "@/components/LegalLayout";

export default function TermsPage() {
  return (
    <LegalLayout
      eyebrow="Terms"
      title="Terms of Use"
      subtitle="The terms that apply when you use the Milne Bay Province Division of Education website."
      updated="September 2026"
      sections={[
        {
          heading: "About these terms",
          body: (
            <p>
              By using this website you agree to these terms. If you do not agree, please stop using
              the site. The Division of Education may update these terms from time to time; the
              revision date at the top of this page shows the current version.
            </p>
          ),
        },
        {
          heading: "About the information on this site",
          body: (
            <>
              <p>
                We work to keep the information on this site accurate and up to date, but it is
                published for general information. It does not replace official notices, gazettal, or
                instructions issued by the National Department of Education or the Teaching Service
                Commission.
              </p>
              <p>
                Where a deadline, fee, syllabus requirement, examination detail or eligibility rule
                matters, please confirm it with the Division or your school before acting on it. We
                are not liable for decisions made in reliance on information that is out of date or
                inaccurate.
              </p>
            </>
          ),
        },
        {
          heading: "How you may use the site",
          body: (
            <>
              <p>You may read, print and download material for your own education, work or study.</p>
              <p>You may not:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>republish Division content as your own or imply endorsement of your use;</li>
                <li>
                  use automated tools to scrape the site in a way that degrades service for others;
                </li>
                <li>
                  attempt to gain unauthorised access to the site, its administration area or its
                  database; or
                </li>
                <li>
                  submit content that is unlawful, misleading, or infringes the rights of others.
                </li>
              </ul>
              <p>
                If you want to reuse Division material beyond personal use — including in
                publications, course packs or commercial material — please ask permission via the{" "}
                <Link href="/contact">contact form</Link>.
              </p>
            </>
          ),
        },
        {
          heading: "Content you submit",
          body: (
            <p>
              When you send us a message or sign up for announcements you keep ownership of what you
              send. You give the Division permission to read, store and reply to it, and to publish
              it as an official announcement where that is the purpose for which you submitted it.
              Please do not send confidential or sensitive personal information through the contact
              form.
            </p>
          ),
        },
        {
          heading: "Availability and links",
          body: (
            <p>
              We aim to keep the site available and accurate but do not guarantee that it will always
              be online or free of errors. The site links to other organisations such as the National
              Department of Education and the Teaching Service Commission. We do not control those
              sites and are not responsible for their content.
            </p>
          ),
        },
        {
          heading: "Liability",
          body: (
            <p>
              To the extent permitted by law, the Division of Education is not liable for loss or
              damage arising from reliance on, or inability to access, this website or its content.
              Nothing in these terms limits rights you have under PNG law.
            </p>
          ),
        },
        {
          heading: "Governing law and contact",
          body: (
            <p>
              These terms are governed by the laws of Papua New Guinea. For any question about this
              website or these terms, email{" "}
              <a href="mailto:info@mbpeducation.gov.pg">info@mbpeducation.gov.pg</a>, call{" "}
              <a href="tel:+6756411234">+675 641 1234</a>, or use the{" "}
              <Link href="/contact">contact form</Link>.
            </p>
          ),
        },
      ]}
    />
  );
}
